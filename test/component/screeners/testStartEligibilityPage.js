'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeathCertificate = require('app/steps/ui/screeners/deathcertificate/index');
const commonContent = require('app/resources/en/translation/common');
const config = require('app/config');
const featureToggleUrl = config.featureToggles.url;
const feesApiFeatureTogglePath = `${config.featureToggles.path}/${config.featureToggles.fees_api}`;
const nock = require('nock');

describe('start-eligibility', () => {
    let testWrapper;
    const expectedNextUrlForDeathCertificate = DeathCertificate.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('StartEligibility');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test right content loaded on the page with the fees_api toggle ON', (done) => {
            const featureTogglesNock = (status = 'true') => {
                nock(featureToggleUrl)
                    .get(feesApiFeatureTogglePath)
                    .reply(200, status);
            };
            const excludeKeys = [
                'paragraph2',
                'paragraph7old',
                'paragraph8old'
            ];
            featureTogglesNock();
            testWrapper.testContent(done, excludeKeys);
        });

        it('test right content loaded on the page with the fees_api toggle OFF', (done) => {
            const featureTogglesNock = (status = 'false') => {
                nock(featureToggleUrl)
                    .get(feesApiFeatureTogglePath)
                    .reply(200, status);
            };
            const excludeKeys = [
                'paragraph2',
                'paragraph7',
                'paragraph8',
                'tableHeadLeft',
                'tableHeadRight',
                'tableBodyFeeRange1',
                'tableBodyFeeRange1Value',
                'tableBodyFeeRange2',
                'tableBodyFeeRange2Value',
                'tableBodyFeeRange3',
                'tableBodyFeeRange3Value',
                'tableBodyFeeRange4',
                'tableBodyFeeRange4Value',
                'tableBodyFeeRange5',
                'tableBodyFeeRange5Value',
                'tableBodyFeeRange6',
                'tableBodyFeeRange6Value',
                'tableBodyFeeRange7',
                'tableBodyFeeRange7Value'
            ];
            featureTogglesNock();
            testWrapper.testContent(done, excludeKeys);
        });

        it(`test it redirects to next page: ${expectedNextUrlForDeathCertificate}`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForDeathCertificate);
        });

        it('test "save and close" and "sign out" links are not displayed on the page', (done) => {
            const playbackData = {};
            playbackData.saveAndClose = commonContent.saveAndClose;
            playbackData.signOut = commonContent.signOut;

            testWrapper.testContentNotPresent(done, playbackData);
        });
    });
});
