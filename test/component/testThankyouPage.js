const TestWrapper = require('test/util/TestWrapper');
const config = require('app/config');

describe('thank-you', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('ThankYou');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test right content loaded on the page when NO soft stop', (done) => {
            const sessionData = {
                applicant: {
                    nameAsOnTheWill: 'Yes'
                },
                will: {
                    isCodicilsDate: 'Yes'
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        const excludeKeys = ['stopParagraph1'];
                        const contentData = {
                            helpLineNumber: config.links.helpLineNumber
                        };

                        testWrapper.testContent(done, excludeKeys, contentData);
                    });
        });

        it('test right content loaded on the page when soft stop', (done) => {
            const sessionData = {
                applicant: {
                    nameAsOnTheWill: 'No'
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end(() => {
                        const excludeKeys = ['successParagraph1', 'successHeading1', 'successParagraph2', 'contactProbateOffice'];

                        testWrapper.testContent(done, excludeKeys);
                    });
        });

    });
});
