'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeathCertificate = require('app/steps/ui/deceased/deathcertificate/index');
const StopPage = require('app/steps/ui/stoppage/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

describe('will-original', () => {
    let testWrapper;
    let cookies;
    const expectedNextUrlForStopPage = StopPage.getUrl('notOriginal');
    const expectedNextUrlForDeathCertificate = DeathCertificate.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('WillOriginal');

        cookies = [{
            name: '__eligibility',
            content: {
                nextStepUrl: '/will-original',
                pages: [
                    '/will-left'
                ]
            }
        }];
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it ('test the help block content is present', () => {
            testHelpBlockContent.runTest('WillOriginal', cookies);
        });

        it('test right content loaded on the page', (done) => {
            const excludeKeys = [];

            testWrapper.testContent(done, excludeKeys, {}, cookies);
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required', [], cookies);
        });

        it(`test it redirects to Death Certificate page: ${expectedNextUrlForDeathCertificate}`, (done) => {
            const data = {
                original: 'Yes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForDeathCertificate, cookies);
        });

        it(`test it redirects to stop page: ${expectedNextUrlForStopPage}`, (done) => {
            const data = {
                original: 'No'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForStopPage, cookies);
        });

    });
});
