'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedAlias = require('app/steps/ui/deceased/alias/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');
const config = require('app/config');
const nock = require('nock');
const featureToggleUrl = config.featureToggles.url;
const intestacyQuestionsFeatureTogglePath = `${config.featureToggles.path}/${config.featureToggles.intestacy_questions}`;
const featureTogglesNock = (status = 'true') => {
    nock(featureToggleUrl)
        .get(intestacyQuestionsFeatureTogglePath)
        .reply(200, status);
};

describe('value-assets-outside-england-wales', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedAlias = DeceasedAlias.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ValueAssetsOutside');
        featureTogglesNock();
    });

    afterEach(() => {
        testWrapper.destroy();
        nock.cleanAll();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('ValueAssetsOutside', featureTogglesNock);

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done, [], {});
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required', []);
        });

        it(`test it redirects to next page: ${expectedNextUrlForDeceasedAlias}`, (done) => {
            testWrapper.agent.post('/prepare-session-field/willLeft/No')
                .end(() => {
                    const data = {
                        netValueAssetsOutsideField: '300000'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedAlias);
                });
        });
    });
});
