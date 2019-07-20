'use strict';

const TestWrapper = require('test/util/TestWrapper');
const CopiesUk = require('app/steps/ui/copies/uk');
const config = require('app/config');
const featureToggleUrl = config.featureToggles.url;
const copiesFeesFeatureTogglePath = `${config.featureToggles.path}/${config.featureToggles.copies_fees}`;
const nock = require('nock');

describe('copies-start', () => {
    let testWrapper;
    const expectedNextUrlForCopiesUk = CopiesUk.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('CopiesStart');
    });

    afterEach(() => {
        testWrapper.destroy();
        nock.cleanAll();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test right content loaded on the page with the copies_fees toggle OFF', (done) => {
            const copiesFeesFeatureTogglesNock = (status = 'false') => {
                nock(featureToggleUrl)
                    .get(copiesFeesFeatureTogglePath)
                    .reply(200, status);
            };
            const excludeKeys = [
                'paragraph2_2'
            ];
            copiesFeesFeatureTogglesNock();
            testWrapper.testContent(done, excludeKeys);
        });

        it('test right content loaded on the page with the copies_fees toggle ON', (done) => {
            const copiesFeesFeatureTogglesNock = (status = 'true') => {
                nock(featureToggleUrl)
                    .get(copiesFeesFeatureTogglePath)
                    .reply(200, status);
            };
            const excludeKeys = [
                'paragraph2_1'
            ];
            copiesFeesFeatureTogglesNock();
            testWrapper.testContent(done, excludeKeys);
        });

        it(`test it redirects to next page: ${expectedNextUrlForCopiesUk}`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForCopiesUk);
        });

    });
});
