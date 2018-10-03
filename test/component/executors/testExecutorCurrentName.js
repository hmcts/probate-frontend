'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ExecutorCurrentName = require('app/steps/ui/executors/currentname/index');
const ExecutorCurrentNameReason = require('app/steps/ui/executors/currentnamereason/index');
const ExecutorContactDetails = require('app/steps/ui/executors/contactdetails/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

describe('executor-current-name', () => {
    let testWrapper, sessionData;
    const FirstExecURL = ExecutorCurrentName.getUrl(4);
    const NextExecURL = ExecutorCurrentName.getUrl(6);
    const executorCurrentNameReasonFirstUrl = ExecutorCurrentNameReason.getUrl(4);
    const executorCurrentNameReasonSubsequentUrl = ExecutorCurrentNameReason.getUrl(6);
    const executorContactDetailsUrl = ExecutorContactDetails.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorCurrentName');
        sessionData = {
            'executors': {
                'list': [
                    {'firstName': 'john', 'lastName': 'theapplicant', 'isApplying': true, 'isApplicant': true},
                    {'fullName': 'executor name1', hasOtherName: false},
                    {'fullName': 'executor name2', hasOtherName: true},
                    {'fullName': 'executor name3', hasOtherName: false},
                    {'fullName': 'executor name4', hasOtherName: true},
                    {'fullName': 'executor name5', hasOtherName: false},
                    {'fullName': 'executor name6', hasOtherName: true}
                ]
            }
        };
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        testHelpBlockContent.runTest('WillLeft');

        it('test content loaded on the page', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        executorFullName: 'executor name2',
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
                        currentName: '< brian'
                    };
                testWrapper.testErrors(done, data, 'invalid', errorsToTest);
            });
        });

        it(`test it redirects to next executor current name page, first exec: ${executorCurrentNameReasonFirstUrl}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        currentName: 'another name2'
                    };
                    testWrapper.testRedirect(done, data, executorCurrentNameReasonFirstUrl);
                });
        });

        it(`test it redirects to next executor current name page, subsequent exec: ${executorCurrentNameReasonSubsequentUrl}`, (done) => {
            testWrapper.pageUrl = FirstExecURL;
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        currentName: 'another name'
                    };
                    testWrapper.testRedirect(done, data, executorCurrentNameReasonSubsequentUrl);
                });
        });

        it(`test it redirects to executor contact details page, final exec: ${executorContactDetailsUrl}`, (done) => {
            testWrapper.pageUrl = NextExecURL;
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        currentName: 'another name also'
                    };
                    testWrapper.testRedirect(done, data, executorContactDetailsUrl);
                });
        });
    });
});
