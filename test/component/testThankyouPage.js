'use strict';

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
                ccdCase: {
                    id: '1234-5678-9012-3456'
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = ['stopParagraph1'];
                    const contentData = {
                        helpLineNumber: config.helpline.number,
                        findOutNext: config.links.findOutNext
                    };

                    testWrapper.testContent(done, excludeKeys, contentData);
                });
        });

        it('test right content loaded on the page when soft stop', (done) => {
            const sessionData = {
                applicant: {
                    nameAsOnTheWill: 'No'
                },
                ccdCase: {
                    id: '1234-5678-9012-3456'
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = ['referenceNumber', 'successHeading1', 'successParagraph1', 'successParagraph2', 'successParagraph3', 'successParagraph4'];

                    testWrapper.testContent(done, excludeKeys);
                });
        });
    });
});
