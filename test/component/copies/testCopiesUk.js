'use strict';

const TestWrapper = require('test/util/TestWrapper');
const AssetsOverseas = require('app/steps/ui/assets/overseas');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');
const config = require('app/config');
const featureToggleUrl = config.featureToggles.url;
const feesApiFeatureTogglePath = `${config.featureToggles.path}/${config.featureToggles.fees_api}`;
const copiesFeesFeatureTogglePath = `${config.featureToggles.path}/${config.featureToggles.copies_fees}`;
const nock = require('nock');

describe('copies-uk', () => {
    let testWrapper;
    const expectedNextUrlForAssetsOverseas = AssetsOverseas.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('CopiesUk');
    });

    afterEach(() => {
        testWrapper.destroy();
        nock.cleanAll();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('CopiesUk');

        it('test right content loaded on the page with the fees_api toggle ON', (done) => {
            const feesApiFeatureTogglesNock = (status = 'true') => {
                nock(featureToggleUrl)
                    .get(feesApiFeatureTogglePath)
                    .reply(200, status);
            };
            const excludeKeys = [
                'questionOld_1',
                'questionOld_2',
                'paragraph1Old_2',
                'paragraph2Old_2',
                'paragraph3Old_2',
                'copiesOld_1',
                'copiesOld_2'
            ];
            feesApiFeatureTogglesNock();
            testWrapper.testContent(done, excludeKeys);
        });

        it('test right content loaded on the page with the fees_api toggle OFF and the copies_fees toggle OFF', (done) => {
            const feesApiFeatureTogglesNock = (status = 'false') => {
                nock(featureToggleUrl)
                    .get(feesApiFeatureTogglePath)
                    .reply(200, status);
            };
            const copiesFeesFeatureTogglesNock = (status = 'false') => {
                nock(featureToggleUrl)
                    .get(copiesFeesFeatureTogglePath)
                    .reply(200, status);
            };
            const excludeKeys = [
                'question',
                'paragraph1',
                'paragraph2',
                'paragraph3',
                'bullet1',
                'bullet2',
                'copies',
                'questionOld_2',
                'paragraph1Old_2',
                'paragraph2Old_2',
                'paragraph3Old_2',
                'copiesOld_2'
            ];
            feesApiFeatureTogglesNock();
            copiesFeesFeatureTogglesNock();
            testWrapper.testContent(done, excludeKeys);
        });

        it('test right content loaded on the page with the fees_api toggle OFF and the copies_fees toggle ON', (done) => {
            const feesApiFeatureTogglesNock = (status = 'false') => {
                nock(featureToggleUrl)
                    .get(feesApiFeatureTogglePath)
                    .reply(200, status);
            };
            const copiesFeesFeatureTogglesNock = (status = 'true') => {
                nock(featureToggleUrl)
                    .get(copiesFeesFeatureTogglePath)
                    .reply(200, status);
            };
            const excludeKeys = [
                'question',
                'paragraph1',
                'paragraph2',
                'paragraph3',
                'bullet1',
                'bullet2',
                'copies',
                'questionOld_1',
                'copiesOld_1'
            ];
            feesApiFeatureTogglesNock();
            copiesFeesFeatureTogglesNock();
            testWrapper.testContent(done, excludeKeys);
        });

        it('test errors message displayed for invalid data, text values', (done) => {
            const data = {uk: 'abcd'};

            testWrapper.testErrors(done, data, 'invalid', []);
        });

        it('test errors message displayed for invalid data, special characters', (done) => {
            const data = {uk: '//1234//'};

            testWrapper.testErrors(done, data, 'invalid', []);
        });

        it('test errors message displayed for missing data, nothing entered', (done) => {
            const data = {uk: ''};

            testWrapper.testErrors(done, data, 'required', []);
        });

        it('test errors message displayed for invalid data, negative numbers', (done) => {
            const data = {uk: '-1'};

            testWrapper.testErrors(done, data, 'invalid', []);
        });

        it(`test it redirects to next page: ${expectedNextUrlForAssetsOverseas}`, (done) => {
            const data = {uk: '0'};
            const sessionData = require('test/data/copiesUk');
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testRedirect(done, data, expectedNextUrlForAssetsOverseas);
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForAssetsOverseas}`, (done) => {
            const data = {uk: '1'};
            const sessionData = require('test/data/copiesUk');

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testRedirect(done, data, expectedNextUrlForAssetsOverseas);
                });
        });
    });
});
