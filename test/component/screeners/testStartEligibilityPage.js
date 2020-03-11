'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeathCertificate = require('app/steps/ui/screeners/deathcertificate');
const commonContent = require('app/resources/en/translation/common');
const config = require('config');
const featureToggleUrl = config.featureToggles.url;
const feesApiFeatureTogglePath = `${config.featureToggles.path}/${config.featureToggles.fees_api}`;
const nock = require('nock');
const beforeEachNocks = (status = 'true') => {
    nock(featureToggleUrl)
        .get(feesApiFeatureTogglePath)
        .reply(200, status);
};
const afterEachNocks = (done) => {
    return () => {
        nock.cleanAll();
        done();
    };
};

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
            beforeEachNocks('true');

            const contentToExclude = [
                'paragraph2',
                'paragraph7old',
                'paragraph8old'
            ];

            testWrapper.testContent(afterEachNocks(done), {}, contentToExclude);
        });

        it('test right content loaded on the page with the fees_api toggle OFF', (done) => {
            beforeEachNocks('false');

            const contentToExclude = [
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

            testWrapper.testContent(afterEachNocks(done), {}, contentToExclude);
        });

        it(`test it redirects to next page: ${expectedNextUrlForDeathCertificate}`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForDeathCertificate);
        });

        it('test "save and close" link is not displayed on the page', (done) => {
            const playbackData = {
                saveAndClose: commonContent.saveAndClose
            };

            testWrapper.testContentNotPresent(done, playbackData);
        });
    });
});
