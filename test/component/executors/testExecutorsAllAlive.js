'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ExecutorsApplying = require('app/steps/ui/executors/applying');
const ExecutorsWhoDied = require('app/steps/ui/executors/whodied');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('executors-all-alive', () => {
    let testWrapper;
    const expectedNextUrlForExecsApplying = ExecutorsApplying.getUrl(1);
    const expectedNextUrlForExecsWhoDied = ExecutorsWhoDied.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorsAllAlive');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ExecutorsAllAlive', null, null, [], false, {type: caseTypes.GOP});

        it('test right content loaded on the page', (done) => {
            const sessionData = {
                type: caseTypes.GOP,
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            const sessionData = {
                type: caseTypes.GOP,
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                executors: {
                    executorsNumber: 3,
                    list: [
                        {firstName: 'John', lastName: 'TheApplicant', isApplying: true, isApplicant: true},
                        {fullName: 'Many Clouds', isApplying: true},
                        {fullName: 'Harvey Smith', isApplying: false}
                    ]
                },
                applicant: {}
            };
            const errorsToTest = ['allalive'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                    };
                    testWrapper.testErrors(done, data, 'multipleExecutorRequired', errorsToTest);
                });
        });

        it(`test it redirects to executors applying: ${expectedNextUrlForExecsApplying}`, (done) => {
            const data = {
                allalive: 'optionNo',
                list: [{fullName: 'ExecutorOne'}, {fullName: 'ExecutorTwo'}, {fullName: 'ExecutorThree'}]
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForExecsApplying);
        });

        it(`test it redirects to which executors died: ${expectedNextUrlForExecsWhoDied}`, (done) => {
            const data = {
                allalive: 'optionYes',
                list: [{fullName: 'ExecutorOne'}, {fullName: 'ExecutorTwo'}, {fullName: 'ExecutorThree'}]
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForExecsWhoDied);
        });
    });
});
