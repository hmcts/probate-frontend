const TestWrapper = require('test/util/TestWrapper'),
    ExecutorsAlias = require('app/steps/ui/executors/alias/index');

describe('executors-dealing-with-estate', () => {
    let testWrapper, sessionData;
    const expectedNextUrlForExecAlias = ExecutorsAlias.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorsDealingWithEstate');
        sessionData = {
            'executors': {
                'executorsNumber': 3,
                'list': [
                    {'firstName': 'john', 'lastName': 'theapplicant', 'isApplying': true, 'isApplicant': true},
                    {'fullName': 'many clouds', isApplying: true},
                    {'fullName': 'harvey smith', isApplying: false}
                ]
            }
        };
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test content loaded on the page', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            const errorsToTest = ['executorsApplying'];
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {};
                    testWrapper.testErrors(done, data, 'required', errorsToTest);
                });
        });

        it(`test it redirects to Executors Alias page: ${expectedNextUrlForExecAlias}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        executorsApplying: 'many clouds'
                    };
                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl();
                    testWrapper.testRedirect(done, data, expectedNextUrlForExecAlias);
                });
        });
    });
});