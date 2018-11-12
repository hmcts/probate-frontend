'use strict';

const TestWrapper = require('test/util/TestWrapper');
const AssetsOverseas = require('app/steps/ui/assets/overseas/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

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
        testHelpBlockContent.runTest('CopiesUk');

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done);
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
            testWrapper.testRedirect(done, data, expectedNextUrlForAssetsOverseas);
        });

        it(`test it redirects to next page: ${expectedNextUrlForAssetsOverseas}`, (done) => {
            const data = {uk: '1'};
            testWrapper.testRedirect(done, data, expectedNextUrlForAssetsOverseas);
        });
    });
});
