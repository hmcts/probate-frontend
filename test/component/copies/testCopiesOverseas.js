'use strict';

const TestWrapper = require('test/util/TestWrapper');
const CopiesSummary = require('app/steps/ui/copies/summary/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');
const config = require('app/config');
const featureToggleUrl = config.featureToggles.url;
const feesApiFeatureTogglePath = `${config.featureToggles.path}/${config.featureToggles.fees_api}`;
const nock = require('nock');

describe('copies-overseas', () => {
    let testWrapper;
    const expectedNextUrlForCopiesSummary = CopiesSummary.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('CopiesOverseas');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('CopiesOverseas');

        it('test right content loaded on the page with the fees_api toggle ON', (done) => {
            const featureTogglesNock = (status = 'true') => {
                nock(featureToggleUrl)
                    .get(feesApiFeatureTogglePath)
                    .reply(200, status);
            };
            const excludeKeys = [
                'copiesOld'
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
                'paragraph1',
                'bullet1',
                'bullet2',
                'copies'
            ];
            featureTogglesNock();
            testWrapper.testContent(done, excludeKeys);
        });

        it('test errors message displayed for invalid data, text values', (done) => {
            const data = {overseas: 'abcd'};

            testWrapper.testErrors(done, data, 'invalid', []);
        });

        it('test errors message displayed for invalid data, special characters', (done) => {
            const data = {overseas: '//1234//'};

            testWrapper.testErrors(done, data, 'invalid', []);
        });

        it('test errors message displayed for missing data, nothing entered', (done) => {
            const data = {overseas: ''};

            testWrapper.testErrors(done, data, 'required', []);
        });

        it('test errors message displayed for invalid data, negative numbers', (done) => {
            const data = {overseas: '-1'};

            testWrapper.testErrors(done, data, 'invalid', []);
        });

        it(`test it redirects to next page: ${expectedNextUrlForCopiesSummary}`, (done) => {
            const data = {overseas: '0'};
            testWrapper.testRedirect(done, data, expectedNextUrlForCopiesSummary);
        });

        it(`test it redirects to next page: ${expectedNextUrlForCopiesSummary}`, (done) => {
            const data = {overseas: '1'};
            testWrapper.testRedirect(done, data, expectedNextUrlForCopiesSummary);
        });
    });
});
