'use strict';

const requireDir = require('require-directory');
const TestWrapper = require('test/util/TestWrapper');
const deceasedContent = requireDir(module, '../../../app/resources/en/translation/deceased');
const applicantContent = requireDir(module, '../../../app/resources/en/translation/applicant');
const FormatName = require('app/utils/FormatName');

describe('summary-applicants-section', () => {
    let testWrapper;
    let sessionData;

    beforeEach(() => {
        testWrapper = new TestWrapper('Summary');
        sessionData = require('test/data/applicants');
    });

    afterEach(() => {
        delete require.cache[require.resolve('test/data/applicants')];
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test correct content loaded on the applicants section of the summary page, when no data is entered', (done) => {
            sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                caseType: 'intestacy',
            };

            testWrapper.agent.post('/prepare-session-field/language/en')
                .end(() => {
                    testWrapper.agent.post('/prepare-session/form')
                        .send(sessionData)
                        .end((err) => {
                            if (err) {
                                throw err;
                            }
                            const playbackData = {
                                relationshipToDeceased: applicantContent.relationshiptodeceased.question
                            };
                            testWrapper.testDataPlayback(done, playbackData);
                        });
                });
        });

        it('test correct content loaded on the applicants section of the summary page, when section is complete', (done) => {
            sessionData.ccdCase = {
                state: 'Pending',
                id: 1234567890123456
            };
            const deceasedData = require('test/data/deceased');

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    delete require.cache[require.resolve('test/data/deceased')];
                    const deceasedName = FormatName.format(deceasedData.deceased);
                    const playbackData = {
                        relationshipToDeceased: applicantContent.relationshiptodeceased.question,
                        adoptionPlace: applicantContent.adoptionplace.question,
                        spouseNotApplyingReason: applicantContent.spousenotapplyingreason.question.replace('{deceasedName}', deceasedName),
                        anyOtherChildren: deceasedContent.anyotherchildren.question.replace('{deceasedName}', deceasedName),
                        allChildrenOver18: deceasedContent.allchildrenover18.question.replace('{deceasedName}', deceasedName),
                        anyDeceasedChildren: deceasedContent.anydeceasedchildren.question.replace('{deceasedName}', deceasedName).replace('{deceasedDoD}', deceasedData.deceased['dod-formattedDate']),
                        anyGrandchildrenUnder18: deceasedContent.anygrandchildrenunder18.question
                    };

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });
    });
});
