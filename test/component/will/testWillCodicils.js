'use strict';
const TestWrapper = require('test/util/TestWrapper');
const DeathCertificate = require('app/steps/ui/deceased/deathcertificate/index');
const CodicilsNumber = require('app/steps/ui/will/codicilsnumber/index');

describe('will-codicils', () => {
    let testWrapper;
    const expectedNextUrlForDeathCertificate = DeathCertificate.getUrl();
    const expectedNextUrlForCodicilsNumber = CodicilsNumber.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('WillCodicils');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test correct content loaded on the page', (done) => {
            const excludeKeys = [];

            testWrapper.testContent(done, excludeKeys);
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required', []);
        });

        it(`test it redirects to death certificate page: ${expectedNextUrlForDeathCertificate}`, (done) => {
            const data = {
                'codicils': 'No'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForDeathCertificate);
        });

        it(`test it redirects to codicils number page: ${expectedNextUrlForCodicilsNumber}`, (done) => {
            const data = {
                'codicils': 'Yes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForCodicilsNumber);
        });
    });
});
