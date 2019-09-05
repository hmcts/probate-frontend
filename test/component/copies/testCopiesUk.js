'use strict';

const TestWrapper = require('test/util/TestWrapper');
const AssetsOverseas = require('app/steps/ui/assets/overseas');
const testCommonContent = require('test/component/common/testCommonContent.js');
const config = require('app/config');
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

describe('copies-uk', () => {
    let testWrapper;
    const expectedNextUrlForAssetsOverseas = AssetsOverseas.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('CopiesUk');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('CopiesUk');

        it('test right content loaded on the page with the fees_api toggle ON', (done) => {
            beforeEachNocks('true');

            const contentToExclude = [
                'questionOld',
                'paragraph1Old',
                'paragraph2Old',
                'paragraph3Old',
                'copiesOld'
            ];
            testWrapper.testContent(afterEachNocks(done), {}, contentToExclude);
        });

        it('test right content loaded on the page with the fees_api toggle OFF', (done) => {
            beforeEachNocks('false');

            const contentToExclude = [
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

            testWrapper.testContent(afterEachNocks(done), {}, contentToExclude);
        });

        it('test errors message displayed for invalid data, text values', (done) => {
            const data = {uk: 'abcd'};

            testWrapper.testErrors(done, data, 'invalid');
        });

        it('test errors message displayed for invalid data, special characters', (done) => {
            const data = {uk: '//1234//'};

            testWrapper.testErrors(done, data, 'invalid');
        });

        it('test errors message displayed for missing data, nothing entered', (done) => {
            const data = {uk: ''};

            testWrapper.testErrors(done, data, 'required');
        });

        it('test errors message displayed for invalid data, negative numbers', (done) => {
            const data = {uk: '-1'};

            testWrapper.testErrors(done, data, 'invalid');
        });

        it(`test it redirects to next page: ${expectedNextUrlForAssetsOverseas}`, (done) => {
            const data = {uk: '0'};
            const sessionData = require('test/data/copiesUk');

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    delete require.cache[require.resolve('test/data/copiesUk')];

                    testWrapper.testRedirect(done, data, expectedNextUrlForAssetsOverseas);
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForAssetsOverseas}`, (done) => {
            const data = {uk: '1'};
            const sessionData = require('test/data/copiesUk');

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    delete require.cache[require.resolve('test/data/copiesUk')];

                    testWrapper.testRedirect(done, data, expectedNextUrlForAssetsOverseas);
                });
        });
    });
});
