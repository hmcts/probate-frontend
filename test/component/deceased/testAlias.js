const TestWrapper = require('test/util/TestWrapper'),
    DeceasedOtherNames = require('app/steps/ui/deceased/otherNames/index'),
    DeceasedMarried = require('app/steps/ui/deceased/married/index'),
    DeceasedDod = require('app/steps/ui/deceased/dod/index');

describe('deceased-alias', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedOtherNames = DeceasedOtherNames.getUrl();
    const expectedNextUrlForDeceasedMarried = DeceasedMarried.getUrl();
    const expectedNextUrlForDeceasedDod = DeceasedDod.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedAlias');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test right content loaded on the page', (done) => {
            const sessionData = {
                deceased: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {

                const contentData = {deceasedName: 'John Doe'};

                testWrapper.testContent(done, [], contentData);

            });
        });

        it('test alias schema validation when no data is entered', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required', []);
        });

        it(`test it redirects to deceased other names page: ${expectedNextUrlForDeceasedOtherNames}`, (done) => {
            const data = {
                'alias': 'Yes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedOtherNames);
        });

        it(`test it redirects to deceased married page: ${expectedNextUrlForDeceasedMarried}`, (done) => {
            const data = {
                'alias': 'No'
            };
            const sessionData = {
                will: {
                    isWillDate: 'Yes'
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedMarried);
            });
        });

        it(`test it redirects to deceased dod page: ${expectedNextUrlForDeceasedDod}`, (done) => {
            const data = {
                'alias': 'No'
            };
            const sessionData = {
                will: {
                    isWillDate: 'No'
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedDod);
            });
        });

    });
});
