'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ValueAssetsOutside = require('app/steps/ui/iht/valueassetsoutside');
const DeceasedAlias = require('app/steps/ui/deceased/alias');
const testCommonContent = require('test/component/common/testCommonContent.js');
const content = require('app/resources/en/translation/iht/assetsoutside');
const config = require('app/config');
const caseTypes = require('app/utils/CaseTypes');
const nock = require('nock');
const featureToggleUrl = config.featureToggles.url;
const featureTogglePath = `${config.featureToggles.path}/${config.featureToggles.intestacy_questions}`;
const featureTogglesNock = (status = 'true') => {
    nock(featureToggleUrl)
        .get(featureTogglePath)
        .reply(200, status);
};

describe('assets-outside-england-wales', () => {
    let testWrapper;
    const expectedNextUrlForValueAssetsOutside = ValueAssetsOutside.getUrl();
    const expectedNextUrlForDeceasedAlias = DeceasedAlias.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('AssetsOutside');
        featureTogglesNock();
    });

    afterEach(() => {
        testWrapper.destroy();
        nock.cleanAll();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('AssetsOutside', featureTogglesNock);

        it('test content loaded on the page', (done) => {
            const sessionData = {
                deceased: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {deceasedName: 'John Doe'};

                    testWrapper.testContent(done, [], contentData);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required', []);
        });

        it(`test it redirects to value of assets outside page: ${expectedNextUrlForValueAssetsOutside}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        assetsOutside: content.optionYes
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForValueAssetsOutside);
                });
        });

        it(`test it redirects to Deceased Alias page: ${expectedNextUrlForDeceasedAlias}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        assetsOutside: content.optionNo
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedAlias);
                });
        });
    });
});
