'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeathCertificate = require('app/steps/ui/deceased/deathcertificate/index');
const StopPage = require('app/steps/ui/stoppage/index');
const json = require('app/resources/en/translation/will/original.json');

describe('will-original', () => {
    let testWrapper;
    const expectedNextUrlForDeathCertificate = DeathCertificate.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('notOriginal');

    beforeEach(() => {
        testWrapper = new TestWrapper('WillOriginal');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test right content loaded on the page', (done) => {
            const excludeKeys = [];

            testWrapper.testContent(done, excludeKeys);
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required', []);
        });

        it(`test it redirects to death certificate if original will owned: ${expectedNextUrlForDeathCertificate}`, (done) => {
            const data = {
                'original': json.optionYes
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForDeathCertificate);
        });

        it(`test it redirects to stop page if original will not owned: ${expectedNextUrlForStopPage}`, (done) => {
            const data = {
                'original': json.optionNo
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
        });

    });
});
