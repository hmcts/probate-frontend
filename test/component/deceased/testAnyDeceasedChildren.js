'use strict';

const TestWrapper = require('test/util/TestWrapper');
const AnyGrandchildrenUnder18 = require('app/steps/ui/deceased/anygrandchildrenunder18/index');
const ApplicantName = require('app/steps/ui/applicant/name/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');
const content = require('app/resources/en/translation/deceased/anychildren');
const config = require('app/config');
const nock = require('nock');
const featureToggleUrl = config.featureToggles.url;
const intestacyQuestionsFeatureTogglePath = `${config.featureToggles.path}/${config.featureToggles.intestacy_questions}`;
const featureTogglesNock = (status = 'true') => {
    nock(featureToggleUrl)
        .get(intestacyQuestionsFeatureTogglePath)
        .reply(200, status);
};

describe('any-deceased-children', () => {
    let testWrapper;
    const expectedNextUrlForAnyGrandchildrenUnder18 = AnyGrandchildrenUnder18.getUrl();
    const expectedNextUrlForApplicantName = ApplicantName.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('AnyDeceasedChildren');
        featureTogglesNock();
    });

    afterEach(() => {
        testWrapper.destroy();
        nock.cleanAll();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('AnyDeceasedChildren');

        it('test content loaded on the page', (done) => {
            const sessionData = {
                deceased: {
                    firstName: 'John',
                    lastName: 'Doe',
                    dod_formattedDate: '13 October 2018'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {deceasedName: 'John Doe', deceasedDoD: '13 October 2018'};
                    testWrapper.testContent(done, [], contentData);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required', []);
        });

        it(`test it redirects to Any Grandchildren Under 18 page if deceased had children who died before them: ${expectedNextUrlForAnyGrandchildrenUnder18}`, (done) => {
            testWrapper.agent.post('/prepare-session-field/willLeft/No')
                .end(() => {
                    const data = {
                        anyDeceasedChildren: content.optionYes
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForAnyGrandchildrenUnder18);
                });
        });

        it(`test it redirects to Applicant Name page if deceased had no children who died before them: ${expectedNextUrlForApplicantName}`, (done) => {
            testWrapper.agent.post('/prepare-session-field/willLeft/No')
                .end(() => {
                    const data = {
                        anyDeceasedChildren: content.optionNo
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForApplicantName);
                });
        });
    });
});
