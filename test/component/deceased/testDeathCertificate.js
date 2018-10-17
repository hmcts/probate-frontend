'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedDomicile = require('app/steps/ui/deceased/domicile/index');
const StopPage = require('app/steps/ui/stoppage/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');
const cookies = [{
    name: '__eligibility',
    content: {
        nextStepUrl: '/death-certificate',
        pages: [
            '/will-left',
            '/will-original'
        ]
    }
}];

describe('death-certificate', () => {
    let testWrapper;
    const expectedNextUrlForStopPage = StopPage.getUrl('deathCertificate');
    const expectedNextUrlForDeceasedDomicile = DeceasedDomicile.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeathCertificate');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        testHelpBlockContent.runTest('DeathCertificate', cookies);

        it('test right content loaded on the page', (done) => {
            const excludeKeys = [];

            testWrapper.testContent(done, excludeKeys, {}, cookies);
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required', [], cookies);
        });

        it(`test it redirects to Deceased Domicile page: ${expectedNextUrlForDeceasedDomicile}`, (done) => {
            const data = {
                deathCertificate: 'Yes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedDomicile, cookies);
        });

        it(`test it redirects to stop page: ${expectedNextUrlForStopPage}`, (done) => {
            const data = {
                deathCertificate: 'No'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForStopPage, cookies);
        });

    });
});
