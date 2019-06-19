'use strict';

const requireDir = require('require-directory');
const TestWrapper = require('test/util/TestWrapper');
const deceasedData = require('test/data/deceased');
const deceasedContent = requireDir(module, '../../../app/resources/en/translation/deceased');
const applicantContent = requireDir(module, '../../../app/resources/en/translation/applicant');
const FormatName = require('app/utils/FormatName');

const config = require('app/config');
const nock = require('nock');
const featureToggleUrl = config.featureToggles.url;
const intestacyQuestionsFeatureTogglePath = `${config.featureToggles.path}/${config.featureToggles.intestacy_questions}`;
const featureTogglesNock = (status = 'true') => {
    nock(featureToggleUrl)
        .get(intestacyQuestionsFeatureTogglePath)
        .reply(200, status);
};

describe('summary-applicants-section', () => {
    let testWrapper, sessionData;

    beforeEach(() => {
        testWrapper = new TestWrapper('Summary');
        sessionData = require('test/data/applicants');
        featureTogglesNock();
    });

    afterEach(() => {
        testWrapper.destroy();
        nock.cleanAll();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test correct content loaded on the applicants section of the summary page, when no data is entered', (done) => {
            sessionData = {
                caseType: 'intestacy',
            };
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

        it('test correct content loaded on the applicants section of the summary page, when section is complete', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    const deceasedName = FormatName.format(deceasedData.deceased);
                    const playbackData = {
                        relationshipToDeceased: applicantContent.relationshiptodeceased.question,
                        adoptionPlace: applicantContent.adoptionplace.question,
                        spouseNotApplyingReason: applicantContent.spousenotapplyingreason.question.replace('{deceasedName}', deceasedName),
                        anyOtherChildren: deceasedContent.anyotherchildren.question.replace('{deceasedName}', deceasedName),
                        allChildrenOver18: deceasedContent.allchildrenover18.question.replace('{deceasedName}', deceasedName),
                        anyDeceasedChildren: deceasedContent.anydeceasedchildren.question.replace('{deceasedName}', deceasedName).replace('{deceasedDoD}', deceasedData.deceased.dod_formattedDate),
                        anyGrandchildrenUnder18: deceasedContent.anygrandchildrenunder18.question
                    };
                    testWrapper.testDataPlayback(done, playbackData);
                });
        });
    });
});
