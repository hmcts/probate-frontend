'use strict';

const TestWrapper = require('test/util/TestWrapper');
const WillCodicils = require('app/steps/ui/will/codicils/index');

describe('deceased-married', () => {
    let testWrapper;
    const expectedNextUrlForWillCodicils = WillCodicils.getUrl();

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

        it('test correct content is loaded on the page when there are codicils', (done) => {
            const sessionData = {
                'deceased': {
                    'firstName': 'Mana', 'lastName': 'Manah'
                 },
                 will: {
                     codicils: 'Yes'
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

        it(`test it redirects to will codicils page: ${expectedNextUrlForWillCodicils}`, (done) => {
            const data = {
                married: 'No'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForWillCodicils);
        });

    });
});
