const TestWrapper = require('test/util/TestWrapper'),
    DeceasedDod = require('app/steps/ui/deceased/dod/index');


describe('deceased-married', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedDod = DeceasedDod.getUrl();


    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedMarried');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test correct content is loaded on the page', (done) => {
            const sessionData = {
                'deceased': {
                    'firstName': 'Mana', 'lastName': 'Manah'
                }
            };
            const excludeKeys = ['questionWithCodicil', 'legendWithCodicil'];

            testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {

                const contentData = {deceasedName: 'Mana Manah'};

                testWrapper.testContent(done, excludeKeys, contentData);
            });

        });


        it('test correct content is loaded on the page when there is a dated codicil', (done) => {
            const sessionData = {
                'deceased': {
                    'firstName': 'Mana', 'lastName': 'Manah'
                 },
                 will: {
                     isCodicilsDate: 'Yes'
                 }
            };

            const excludeKeys = ['question', 'legend'];

            testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {

                        const contentData = {deceasedName: 'Mana Manah'};

                testWrapper.testContent(done, excludeKeys, contentData);
            });

        });

        it('test deceased married schema validation when no data is entered', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required', []);
        });

        it(`test it redirects to deceased dod: ${expectedNextUrlForDeceasedDod}`, (done) => {
            const data = {
                married: 'No'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedDod);
        });

    });
});
