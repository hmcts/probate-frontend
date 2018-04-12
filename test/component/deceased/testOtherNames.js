const TestWrapper = require('test/util/TestWrapper'),
      {set} = require('lodash'),
      DeceasedDod = require('app/steps/ui/deceased/dod/index');

describe('deceased-otherNames', () => {
    let testWrapper, sessionData;
    const expectedNextUrlForDeceasedDod = DeceasedDod.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedOtherNames');
        sessionData = {};
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test right content loaded on the page', (done) => {
            set(sessionData, 'deceased.firstName', 'John');
            set(sessionData, 'deceased.lastName', 'Doe');

            testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {

                        const contentData = {deceasedName: 'John Doe'};


                testWrapper.testContent(done, [], contentData);
            });
        });

        it('test right content loaded on the page', (done) => {
            set(sessionData, 'deceased.firstName', 'John');
            set(sessionData, 'deceased.lastName', 'Doe');
            set(sessionData, 'deceased.otherNames.name_0.firstName', 'James');
            set(sessionData, 'deceased.otherNames.name_0.lastName', 'Miller');

            testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {

                        const contentData = {
                            deceasedName: 'John Doe',
                            aliasLastName: 'James Miller',
                        };

                testWrapper.testContent(done, [], contentData);
            });
        });

        it('test otherNames schema validation when no data is entered', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required', []);
        });

        it('test otherNames schema validation when invalid firstname is entered', (done) => {
            const data = {};
            set(data, 'otherNames.name_0.firstName', '<John');
            set(data, 'otherNames.name_0.lastName', 'Doe');

            testWrapper.testErrors(done, data, 'invalid', ['firstName']);
        });

        it('test otherNames schema validation when invalid lastname is entered', (done) => {
            const data = {};
            set(data, 'otherNames.name_0.firstName', 'John');
            set(data, 'otherNames.name_0.lastName', '<Doe');

            testWrapper.testErrors(done, data, 'invalid', ['lastName']);
        });

        it('test it redirects to deceased married page', (done) => {
            const data = {};
            set(sessionData, 'will.isWillDate', true);
            set(data, 'otherNames.name_0.firstName', 'John');
            set(data, 'otherNames.name_0.lastName', 'Doe');

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.nextPageUrl = testWrapper.nextStep(sessionData.will).constructor.getUrl();
                    const expectedNextUrl = testWrapper.nextPageUrl;
                    testWrapper.testRedirect(done, data, expectedNextUrl);
                });
        });

        it(`test it redirects to deceased dod page: ${expectedNextUrlForDeceasedDod}`, (done) => {
            const data = {};
            set(data, 'otherNames.name_0.firstName', 'John');
            set(data, 'otherNames.name_0.lastName', 'Doe');

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedDod);
                });
        });

    });
});
