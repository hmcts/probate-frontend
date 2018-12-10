'use strict';

const TestWrapper = require('test/util/TestWrapper');
const config = require('app/config');
const content = require('app/resources/en/translation/thankyou');

describe('thank-you', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('ThankYou');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test content loaded on the page when CCD Case ID not present', (done) => {
            const sessionData = {};
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        referenceNumber: content.referenceNumber,
                        saveYourApplication: content.saveYourApplication,
                        checkSummaryLink: content.checkAnswersPdf,
                        declarationLink: content.declarationPdf
                    };

                    testWrapper.testContentNotPresent(done, contentData);
                });
        });

        it('test content loaded on the page when CCD Case ID present', (done) => {
            const sessionData = {
                ccdCase: {
                    id: '1234-5678-9012-3456'
                }
            };
            const excludeKeys = ['saveYourApplication', 'saveParagraph1', 'declarationPdf', 'checkAnswersPdf'];
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        helpLineNumber: config.helpline.number,
                        findOutNext: config.links.findOutNext
                    };

                    testWrapper.testContent(done, excludeKeys, contentData);
                });
        });

        it('test content loaded on the page when CheckAnswers present', (done) => {
            const sessionData = {
                ccdCase: {
                    id: '1234-5678-9012-3456'},
                checkAnswersSummary: '{"test":"data"}'
            };
            const excludeKeys = ['declarationPdf'];
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        helpLineNumber: config.helpline.number,
                        findOutNext: config.links.findOutNext,
                        saveYourApplication: content.saveYourApplication,
                        checkSummaryLink: content.checkAnswersPdf
                    };

                    testWrapper.testContent(done, excludeKeys, contentData);

                });
        });

        it('test content not loaded on the page when exclusively CheckAnswers present', (done) => {
            const sessionData = {
                ccdCase: {
                    id: '1234-5678-9012-3456'},
                checkAnswersSummary: '{"test":"data"}'
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludedData = {
                        declarationLink: content.declarationPdf
                    };
                    testWrapper.testContentNotPresent(done, excludedData);
                });
        });

        it('test content loaded on the page when LegalDeclaration present', (done) => {
            const sessionData = {
                ccdCase: {
                    id: '1234-5678-9012-3456'},
                legalDeclaration: '{"test":"data"}'
            };
            const excludeKeys = ['checkAnswersPdf'];
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        helpLineNumber: config.helpline.number,
                        findOutNext: config.links.findOutNext,
                        saveYourApplication: content.saveYourApplication,
                        declarationLink: content.declarationPdf

                    };

                    testWrapper.testContent(done, excludeKeys, contentData);
                });
        });

        it('test content loaded on the page when exclusively LegalDeclaration present', (done) => {
            const sessionData = {
                ccdCase: {
                    id: '1234-5678-9012-3456'},
                legalDeclaration: '{"test":"data"}'
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludedData = {
                        checkSummaryLink: content.checkAnswersPdf
                    };

                    testWrapper.testContentNotPresent(done, excludedData);
                });
        });

        it('test content loaded on the page when CheckAnswers and LegalDeclaration present', (done) => {
            const sessionData = {
                ccdCase: {
                    id: '1234-5678-9012-3456'},
                checkAnswersSummary: '{"test":"data"}',
                legalDeclaration: '{"test":"data"}'
            };
            const excludeKeys = [];
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        helpLineNumber: config.helpline.number,
                        findOutNext: config.links.findOutNext,
                        saveYourApplication: content.saveYourApplication,
                        checkSummaryLink: content.checkAnswersPdf,
                        declarationLink: content.declarationPdf
                    };

                    testWrapper.testContent(done, excludeKeys, contentData);
                });
        });
    });
});
