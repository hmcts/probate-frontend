'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ExecutorsAllAlive = require('app/steps/ui/executors/allalive/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

describe('executors-names', () => {
    let testWrapper, sessionData;
    const expectedNextUrlForExecsAlive = ExecutorsAllAlive.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorsNames');
        sessionData = {
            applicant: {
                firstName: 'John',
                lastName: 'TheApplicant'
            },
            executors: {
                executorsNumber: 2,
                list: [
                    {firstName: 'John', lastName: 'TheApplicant', isApplying: 'Yes', isApplicant: true}
                ]
            }
        };
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('ExecutorsNames');

        it('test correct content loaded on the page when lead applicant does not have an alias', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done);
                });
        });

        it('test correct content loaded on the page when lead applicant does have an alias', (done) => {
            sessionData.executors.list[0].alias = 'Bobby Alias';
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done);
                });
        });

        it('test errors message displayed for invalid data', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        executorName: ['x']
                    };
                    testWrapper.testErrors(done, data, 'invalid', ['executorName']);
                });
        });

        it('test errors message displayed for no name entered', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        executorName: ['']
                    };
                    testWrapper.testErrors(done, data, 'required', ['executorName']);
                });
        });

        it('test errors message displayed when invalid name entered', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        executorName: ['<bob bassett']
                    };
                    testWrapper.testErrors(done, data, 'invalid', ['executorName']);
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForExecsAlive}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        executorName: ['Brian']
                    };
                    testWrapper.testRedirect(done, data, expectedNextUrlForExecsAlive);
                });
        });
    });
});
