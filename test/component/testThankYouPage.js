'use strict';

const TestWrapper = require('test/util/TestWrapper');
const config = require('config');
const content = require('app/resources/en/translation/thankyou');
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
                referenceNumber: content.referenceNumber
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
            const contentToExclude = ['documentsParagraph1', 'intestacyDocumentsParagraph1',
                'successParagraph1NoDocumentsRequired', 'successParagraph2NoDocumentsRequired',
                'declarationPdf', 'checkAnswersPdf',
                'checklist-item1-application-coversheet', 'checklist-item2-no-codicils', 'checklist-item2-codicils',
                'checklist-item3-codicils-written-wishes', 'checklist-item4-interim-death-cert',
                'checklist-item4-foreign-death-cert', 'checklist-item4-foreign-death-cert-translation',
                'checklist-item5-foreign-death-cert-PA19', 'checklist-item6-spouse-renouncing', 'checklist-item7-iht205',
                'checklist-item8-renunciated', 'checklist-item9-deed-poll', 'checklist-item10-iht207',
                'checklist-item11-spouse-giving-up-admin-rights-PA16'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
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
            const contentToExclude = ['documentsParagraph1', 'intestacyDocumentsParagraph1',
                'successParagraph1NoDocumentsRequired', 'successParagraph2NoDocumentsRequired',
                'declarationPdf',
                'checklist-item1-application-coversheet', 'checklist-item2-no-codicils', 'checklist-item2-codicils',
                'checklist-item3-codicils-written-wishes', 'checklist-item4-interim-death-cert',
                'checklist-item4-foreign-death-cert', 'checklist-item4-foreign-death-cert-translation',
                'checklist-item5-foreign-death-cert-PA19', 'checklist-item6-spouse-renouncing', 'checklist-item7-iht205',
                'checklist-item8-renunciated', 'checklist-item9-deed-poll', 'checklist-item10-iht207',
                'checklist-item11-spouse-giving-up-admin-rights-PA16'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        findOutNext: config.links.findOutNext
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
                        downloadApplication: content.checkAnswersPdf
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
            const contentToExclude = ['documentsParagraph1', 'intestacyDocumentsParagraph1',
                'successParagraph1NoDocumentsRequired', 'successParagraph2NoDocumentsRequired', 'checkAnswersPdf',
                'checklist-item1-application-coversheet', 'checklist-item2-no-codicils', 'checklist-item2-codicils',
                'checklist-item3-codicils-written-wishes', 'checklist-item4-interim-death-cert',
                'checklist-item4-foreign-death-cert', 'checklist-item4-foreign-death-cert-translation',
                'checklist-item5-foreign-death-cert-PA19', 'checklist-item6-spouse-renouncing', 'checklist-item7-iht205',
                'checklist-item8-renunciated', 'checklist-item9-deed-poll', 'checklist-item10-iht207',
                'checklist-item11-spouse-giving-up-admin-rights-PA16'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        findOutNext: config.links.findOutNext,
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
                        downloadApplication: content.declarationPdf
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
            const contentToExclude = ['documentsParagraph1', 'intestacyDocumentsParagraph1',
                'successParagraph1NoDocumentsRequired', 'successParagraph2NoDocumentsRequired', 'declarationPdf',
                'checkAnswersPdf',
                'checklist-item1-application-coversheet', 'checklist-item2-no-codicils', 'checklist-item2-codicils',
                'checklist-item3-codicils-written-wishes', 'checklist-item4-interim-death-cert',
                'checklist-item4-foreign-death-cert', 'checklist-item4-foreign-death-cert-translation',
                'checklist-item5-foreign-death-cert-PA19', 'checklist-item6-spouse-renouncing', 'checklist-item7-iht205',
                'checklist-item8-renunciated', 'checklist-item9-deed-poll', 'checklist-item10-iht207',
                'checklist-item11-spouse-giving-up-admin-rights-PA16'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        findOutNext: config.links.findOutNext,
                    };

                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test content loaded on the page when documents are required', (done) => {
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
            const contentToExclude = ['documentsParagraph1', 'intestacyDocumentsParagraph1',
                'successParagraph1NoDocumentsRequired', 'successParagraph2NoDocumentsRequired', 'referenceNumber',
                'declarationPdf', 'checkAnswersPdf',
                'checklist-item1-application-coversheet', 'checklist-item2-no-codicils', 'checklist-item2-codicils',
                'checklist-item3-codicils-written-wishes', 'checklist-item4-interim-death-cert',
                'checklist-item4-foreign-death-cert', 'checklist-item4-foreign-death-cert-translation',
                'checklist-item5-foreign-death-cert-PA19', 'checklist-item6-spouse-renouncing', 'checklist-item7-iht205',
                'checklist-item8-renunciated', 'checklist-item9-deed-poll', 'checklist-item10-iht207',
                'checklist-item11-spouse-giving-up-admin-rights-PA16'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        findOutNext: config.links.findOutNext,
                    };

                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test content loaded on the page when documents not required', (done) => {
            const sessionData = {
                ccdCase: {
                    id: 1234567890123456,
                    state: 'CaseCreated'
                },
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
            const contentToExclude = ['documentsParagraph1', 'intestacyDocumentsParagraph1',
                'documentsParagraph2', 'successParagraph1', 'successParagraph2', 'referenceNumber', 'progressBarStep2',
                'declarationPdf', 'checkAnswersPdf', 'address',
                'checklist-item1-application-coversheet', 'checklist-item2-no-codicils', 'checklist-item2-codicils',
                'checklist-item3-codicils-written-wishes', 'checklist-item4-interim-death-cert',
                'checklist-item4-foreign-death-cert', 'checklist-item4-foreign-death-cert-translation',
                'checklist-item5-foreign-death-cert-PA19', 'checklist-item6-spouse-renouncing', 'checklist-item7-iht205',
                'checklist-item8-renunciated', 'checklist-item9-deed-poll', 'checklist-item10-iht207',
                'checklist-item11-spouse-giving-up-admin-rights-PA16'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        findOutNext: config.links.findOutNext,
                    };
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });
    });
});
