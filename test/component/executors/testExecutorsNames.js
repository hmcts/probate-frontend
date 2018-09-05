const TestWrapper = require('test/util/TestWrapper');
const ExecutorsAllAlive = require('app/steps/ui/executors/allalive/index');

describe('executors-names', () => {
    let testWrapper, sessionData;
    const expectedNextUrlForExecsAlive = ExecutorsAllAlive.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorsNames');
        sessionData = {
            'applicant': {
                'firstName': 'john', 'lastName': 'theapplicant'
            },
            'executors': {
                'executorsNumber': 2,
                'list': [
                    {'firstName': 'john', 'lastName': 'theapplicant', 'isApplying': 'Yes', 'isApplicant': true}
                ]
            }
        };
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

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
