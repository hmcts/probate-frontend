'use strict';

const TestWrapper = require('test/util/TestWrapper');
const config = require('config');
const content = require('app/resources/en/translation/thankyou');
const commonContent = require('app/resources/en/translation/common');
const caseTypes = require('app/utils/CaseTypes');

describe('thank-you', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('ThankYou');
    });

    afterEach(async () => {
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test content loaded on the page when CCD Case ID not present', (done) => {
            const playbackData = {
                referenceNumber: content.referenceNumber,
                checkSummaryLink: content.checkAnswersPdf,
                declarationLink: content.declarationPdf
            };

            testWrapper.testContentNotPresent(done, playbackData);
        });

        it('test content loaded on the page when CCD Case ID present', (done) => {
            const sessionData = {
                ccdCase: {
                    id: 1234567890123456,
                    state: 'CasePrinted'
                },
                declaration: {
                    declarationCheckbox: 'true'
                },
                payment: {
                    total: 0
                },
                caseType: caseTypes.GOP
            };
            const contentToExclude = ['saveYourApplication', 'saveParagraph1', 'declarationPdf', 'checkAnswersPdf',
                'coverSheetPdf', 'successParagraph1NoDocumentsRequired', 'successParagraph2NoDocumentsRequired'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        helpLineNumber: commonContent.helpTelephoneNumber,
                        findOutNext: config.links.findOutNext
                    };

                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test content loaded on the page when CheckAnswers present', (done) => {
            const sessionData = {
                ccdCase: {
                    id: 1234567890123456,
                    state: 'CasePrinted'
                },
                declaration: {
                    declarationCheckbox: 'true'
                },
                payment: {
                    total: 0
                },
                caseType: caseTypes.GOP,
                checkAnswersSummary: '{test: "data"}'
            };
            const contentToExclude = ['declarationPdf', 'coverSheetPdf', 'successParagraph1NoDocumentsRequired',
                'successParagraph2NoDocumentsRequired'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        helpLineNumber: commonContent.helpTelephoneNumber,
                        findOutNext: config.links.findOutNext,
                        saveYourApplication: content.saveYourApplication,
                        checkSummaryLink: content.checkAnswersPdf
                    };

                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test content not loaded on the page when exclusively CheckAnswers present', (done) => {
            const sessionData = {
                ccdCase: {
                    id: 1234567890123456,
                    state: 'CasePrinted'
                },
                checkAnswersSummary: '{test: "data"}'
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const playbackData = {
                        declarationLink: content.declarationPdf
                    };

                    testWrapper.testContentNotPresent(done, playbackData);
                });
        });

        it('test content loaded on the page when LegalDeclaration present', (done) => {
            const sessionData = {
                ccdCase: {
                    id: 1234567890123456,
                    state: 'CasePrinted'
                },
                declaration: {
                    declarationCheckbox: 'true'
                },
                payment: {
                    total: 0
                },
                caseType: caseTypes.GOP,
                legalDeclaration: '{test: "data"}'
            };
            const contentToExclude = ['checkAnswersPdf', 'successParagraph1NoDocumentsRequired',
                'successParagraph2NoDocumentsRequired'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        helpLineNumber: commonContent.helpTelephoneNumber,
                        findOutNext: config.links.findOutNext,
                        saveYourApplication: content.saveYourApplication,
                        declarationLink: content.declarationPdf
                    };

                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test content loaded on the page when exclusively LegalDeclaration present', (done) => {
            const sessionData = {
                ccdCase: {
                    id: 1234567890123456,
                    state: 'CasePrinted'
                },
                legalDeclaration: '{test: "data"}'
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const playbackData = {
                        checkSummaryLink: content.checkAnswersPdf
                    };

                    testWrapper.testContentNotPresent(done, playbackData);
                });
        });

        it('test content loaded on the page when CheckAnswers and LegalDeclaration present', (done) => {
            const sessionData = {
                ccdCase: {
                    id: 1234567890123456,
                    state: 'CasePrinted'
                },
                declaration: {
                    declarationCheckbox: 'true'
                },
                payment: {
                    total: 0
                },
                caseType: caseTypes.GOP,
                checkAnswersSummary: '{test: "data"}',
                legalDeclaration: '{test: "data"}'
            };
            const contentToExclude = ['successParagraph1NoDocumentsRequired', 'successParagraph2NoDocumentsRequired'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        helpLineNumber: commonContent.helpTelephoneNumber,
                        findOutNext: config.links.findOutNext,
                        saveYourApplication: content.saveYourApplication,
                        checkSummaryLink: content.checkAnswersPdf,
                        declarationLink: content.declarationPdf
                    };

                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test content loaded on the page so Cover Sheet download is present', (done) => {
            const sessionData = {
                ccdCase: {
                    id: 1234567890123456,
                    state: 'CasePrinted'
                },
                declaration: {
                    declarationCheckbox: 'true'
                },
                payment: {
                    total: 0
                },
                caseType: caseTypes.GOP
            };
            const contentToExclude = ['checkAnswersPdf', 'declarationPdf', 'successParagraph1NoDocumentsRequired',
                'successParagraph2NoDocumentsRequired'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        helpLineNumber: commonContent.helpTelephoneNumber,
                        findOutNext: config.links.findOutNext,
                        saveYourApplication: content.saveYourApplication,
                        coverSheetLink: content.coverSheetPdf
                    };

                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test content loaded on the page when documents are required', (done) => {
            const sessionData = {
                declaration: {
                    declarationCheckbox: 'true'
                },
                payment: {
                    total: 0
                },
                caseType: caseTypes.GOP
            };
            const contentToExclude = ['saveYourApplication', 'saveParagraph1', 'declarationPdf', 'checkAnswersPdf',
                'coverSheetPdf', 'successParagraph1NoDocumentsRequired', 'successParagraph2NoDocumentsRequired',
                'referenceNumber'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        helpLineNumber: commonContent.helpTelephoneNumber,
                        findOutNext: config.links.findOutNext
                    };

                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test content loaded on the page when documents not required', (done) => {
            const sessionData = {
                declaration: {
                    declarationCheckbox: 'true'
                },
                payment: {
                    total: 0
                },
                caseType: caseTypes.INTESTACY,
                documents: {
                    uploads: ['content']
                }
            };
            const contentToExclude = ['saveYourApplication', 'saveParagraph1', 'declarationPdf', 'checkAnswersPdf',
                'coverSheetPdf', 'successParagraph1', 'successParagraph2', 'referenceNumber'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        helpLineNumber: commonContent.helpTelephoneNumber,
                        findOutNext: config.links.findOutNext
                    };

                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });
    });
});
