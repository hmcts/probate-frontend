'use strict';

const TestWrapper = require('test/util/TestWrapper');
const config = require('app/config');
const commonContent = require('app/resources/en/translation/common');
const caseTypes = require('app/utils/CaseTypes');

describe('recap', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('Recap');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test content loaded on the page before sending the documents', (done) => {
            const sessionData = {
                caseType: caseTypes.GOP,
                ccdCase: {
                    state: 'CaseCreated',
                    id: 1234567890123456
                },
                declaration: {
                    declarationCheckbox: 'true'
                },
                payment: {
                    total: 0
                },
                checkAnswersSummary: 'check answers summary',
                legalDeclaration: 'legal declaration'
            };
            const contentToExclude = [
                'block1Checklist-item1-will-codicils',
                'block1Checklist-item2-spouse-renouncing',
                'block1Checklist-item4-iht205',
                'block1Checklist-item5-spouse-renunciated',
                'block1Checklist-item6-deed-poll',
                'block2Heading',
                'block2Text1',
                'block2Text2',
                'block2Text3',
                'block3Heading',
                'block3Text1',
                'block3Text2',
                'block3Text3'
            ];
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        helpLineNumber: commonContent.helpTelephoneNumber,
                        findOutNext: config.links.findOutNext,
                        ccdReferenceNumberAccessible: '1 2 3 4, -, 5 6 7 8, -, 9 0 1 2, -, 3 4 5 6',
                        ccdReferenceNumber: '1234-5678-9012-3456'
                    };

                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test content loaded on the page after sending the documents', (done) => {
            const sessionData = {
                caseType: caseTypes.GOP,
                ccdCase: {
                    state: 'CaseCreated',
                    id: 1234567890123456
                },
                declaration: {
                    declarationCheckbox: 'true'
                },
                payment: {
                    total: 0
                },
                checkAnswersSummary: 'check answers summary',
                legalDeclaration: 'legal declaration',
                recap: {
                    sentDocuments: true
                }
            };
            const contentToExclude = [
                'block1Checklist-item1-will-no-codicils',
                'block1Checklist-item1-will-codicils',
                'block1Checklist-item2-spouse-renouncing',
                'block1Checklist-item3-will-not-uploaded',
                'block1Checklist-item4-iht205',
                'block1Checklist-item5-spouse-renunciated',
                'block1Checklist-item6-deed-poll',
                'block1Heading1',
                'block1Heading2',
                'block1Text2',
                'block1Text3',
                'block1Text4',
                'block1Text5',
                'block1Text6',
                'block1Text7',
                'block1Text8',
                'block3Heading',
                'block3Text1',
                'block3Text2',
                'block3Text3',
                'sentDocuments'
            ];
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        helpLineNumber: commonContent.helpTelephoneNumber,
                        findOutNext: config.links.findOutNext,
                        ccdReferenceNumberAccessible: '1 2 3 4, -, 5 6 7 8, -, 9 0 1 2, -, 3 4 5 6',
                        ccdReferenceNumber: '1234-5678-9012-3456'
                    };

                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });
    });
});
