'use strict';

const TestWrapper = require('test/util/TestWrapper');
const IhtValue = require('app/steps/ui/iht/value/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

describe('iht-identifier', () => {
    let testWrapper;
    const expectedNextUrlForIhtValue = IhtValue.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('IhtIdentifier');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('IhtIdentifier');

        it('test correct iht identifier page content is loaded', (done) => {
            const contentToExclude = [];
            testWrapper.testContent(done, contentToExclude);
        });

        it('test iht identifier schema validation when no input is entered', (done) => {
            const errorsToTest = [];
            const data = {};
            testWrapper.testErrors(done, data, 'required', errorsToTest);
        });

        it(`test it accepts hyphen separated values, and redirects to next page: ${expectedNextUrlForIhtValue}`, (done) => {
            const data = {
                identifier: '1234-5678-A-123-45'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForIhtValue);
        });

        it(`test it accepts space separated values, redirects to next page: ${expectedNextUrlForIhtValue}`, (done) => {
            const data = {
                identifier: '1234 5678 A 123 45'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForIhtValue);
        });

        it(`test it accepts uppercase values, and redirects to next page: ${expectedNextUrlForIhtValue}`, (done) => {
            const data = {
                identifier: '12345678A12345'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForIhtValue);
        });

        it(`test it accepts lowercase values, and redirects to next page: ${expectedNextUrlForIhtValue}`, (done) => {
            const data = {
                identifier: '12345678z12345'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForIhtValue);
        });
    });
});
