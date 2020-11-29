'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeathCertificate = require('app/steps/ui/screeners/deathcertificate');
const commonContent = require('app/resources/en/translation/common');
const nock = require('nock');

describe('start-eligibility', () => {
    let testWrapper;
    const expectedNextUrlForDeathCertificate = DeathCertificate.getUrl();

    afterEach(async () => {
        nock.cleanAll();
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection - Feature toggles', () => {
        it('test right content loaded on the page with the ft_fees_api toggle ON', (done) => {
            testWrapper = new TestWrapper('StartEligibility', {ft_fees_api: true});

            const contentToExclude = [
                'paragraph2',
                'paragraph7old',
                'paragraph8old'
            ];
            testWrapper.testContent(done, {}, contentToExclude);
        });

        it('test right content loaded on the page with the ft_fees_api toggle OFF', (done) => {
            testWrapper = new TestWrapper('StartEligibility', {ft_fees_api: false});

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

            testWrapper.testContent(done, {}, contentToExclude);
        });
    });

    describe('Verify Content, Errors and Redirection', () => {
        beforeEach(() => {
            testWrapper = new TestWrapper('StartEligibility');
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
