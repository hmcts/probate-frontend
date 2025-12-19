'use strict';

const TestWrapper = require('test/util/TestWrapper');
const CopiesUk = require('app/steps/ui/copies/uk');

describe('copies-start', () => {
    let testWrapper;
    const expectedNextUrlForCopiesUk = CopiesUk.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('CopiesStart');
    });

    afterEach(async () => {
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test right content loaded on the page', (done) => {
            const sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentToExclude = [
                        'paragraph2_1'
                    ];

                    testWrapper.testContent(done, {}, contentToExclude);
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForCopiesUk}`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForCopiesUk);
        });
    });
});
