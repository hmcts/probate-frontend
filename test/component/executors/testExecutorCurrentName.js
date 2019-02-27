'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ExecutorCurrentName = require('app/steps/ui/executors/currentname/index');
const ExecutorCurrentNameReason = require('app/steps/ui/executors/currentnamereason/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

describe('executor-current-name', () => {
    let testWrapper, sessionData;
    const FirstExecURL = ExecutorCurrentName.getUrl(4);
    const executorCurrentNameReasonFirstUrl = ExecutorCurrentNameReason.getUrl(2);
    const executorCurrentNameReasonSubsequentUrl = ExecutorCurrentNameReason.getUrl(4);

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorCurrentName');
        sessionData = {
            executors: {
                list: [
                    {firstName: 'John', lastName: 'TheApplicant', isApplying: true, isApplicant: true},
                    {fullName: 'Executor Name 1', hasOtherName: false},
                    {fullName: 'Executor Name 2', hasOtherName: true},
                    {fullName: 'Executor Name 3', hasOtherName: false},
                    {fullName: 'Executor Name 4', hasOtherName: true},
                    {fullName: 'Executor Name 5', hasOtherName: false},
                    {fullName: 'Executor Name 6', hasOtherName: true}
                ]
            }
        };
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('ExecutorCurrentName');

        it('test content loaded on the page', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        executorFullName: 'Executor Name 2',
                    };
                    testWrapper.testContent(done, [], contentData);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required');
        });

        it('test errors message displayed for invalid currentname', (done) => {
            const errorsToTest = ['currentName'];
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        currentName: '< Brian'
                    };
                    testWrapper.testErrors(done, data, 'invalid', errorsToTest);
                });
        });

        it(`test it redirects to executor current name reason page, first exec: ${executorCurrentNameReasonFirstUrl}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        currentName: 'Another Name 2'
                    };
                    testWrapper.testRedirect(done, data, executorCurrentNameReasonFirstUrl);
                });
        });

        it(`test it redirects to executor current name reason page, subsequent exec: ${executorCurrentNameReasonSubsequentUrl}`, (done) => {
            testWrapper.pageUrl = FirstExecURL;
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        currentName: 'Another Name'
                    };
                    testWrapper.testRedirect(done, data, executorCurrentNameReasonSubsequentUrl);
                });
        });
    });
});
