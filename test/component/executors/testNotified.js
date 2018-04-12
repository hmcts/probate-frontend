const TestWrapper = require('test/util/TestWrapper'),
    DeceasedName = require('app/steps/ui/deceased/name/index'),
    ExecutorRoles = require('app/steps/ui/executors/roles/index');


describe('executor-notified', () => {
    let testWrapper, sessionData;
    const expectedNextUrlForFirstExec = ExecutorRoles.getUrl(2);
    const expectedNextUrlForSecondExec = ExecutorRoles.getUrl(3);
    const expectedNextUrlForThirdExec = DeceasedName.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorNotified');
        sessionData = {
            'executors': {
                'list': [
                    {'firstName': 'john', 'lastName': 'theapplicant', 'isApplying': 'Yes', 'isApplicant': true},
                    {'fullName': 'Manah Mana'},
                    {'fullName': 'Dave Bass'},
                    {'fullName': 'Ann Watt'}
                ],
            }
        };
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test right content loaded on the page', (done) => {

            testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {

                        const contentData = {executorName: 'Manah Mana'};

                testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
                testWrapper.testContent(done, [], contentData);
            });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                const data = {};
                testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
                testWrapper.testErrors(done, data, 'required', []);
            });

        });

        it(`test it redirects to executor roles (first exec): ${expectedNextUrlForFirstExec}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        executorNotified: 'Yes',
                    };
                    testWrapper.testRedirect(done, data, expectedNextUrlForFirstExec);
                });
        });

        it(`test it redirects to executor roles (second exec): ${expectedNextUrlForSecondExec}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        executorNotified: 'Yes'
                    };
                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(2);
                    testWrapper.testRedirect(done, data, expectedNextUrlForSecondExec);
                });
        });

        it(`test it redirects to deceased name page: ${expectedNextUrlForThirdExec}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        executorNotified: 'No'
                    };
                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(3);
                    testWrapper.testRedirect(done, data, expectedNextUrlForThirdExec);
                });
        });
    });
});
