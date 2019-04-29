'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedAlias = require('app/steps/ui/deceased/alias/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

describe('iht-paper', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedAlias = DeceasedAlias.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('IhtPaper');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('IhtPaper');

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done, []);
        });

        it('test errors message displayed for missing data', (done) => {
            const errorsToTest = ['form'];

            testWrapper.testErrors(done, {}, 'required', errorsToTest);
        });

        it('test iht paper schema validation when form 205 is chosen', (done) => {
            const data = {
                form: 'IHT205'
            };

            testWrapper.testErrors(done, data, 'required', ['grossValueFieldIHT205', 'netValueFieldIHT205']);
        });

        it('test iht paper schema validation when form 205 is chosen, and net value is greater than gross value', (done) => {
            const data = {
                form: 'IHT205',
                grossValueFieldIHT205: 999,
                netValueFieldIHT205: 1000
            };

            testWrapper.testErrors(done, data, 'netValueGreaterThanGross', ['netValueFieldIHT205']);
        });

        it('test iht paper schema validation when form 207 is chosen', (done) => {
            const data = {
                form: 'IHT207'
            };

            testWrapper.testErrors(done, data, 'required', ['grossValueFieldIHT207', 'netValueFieldIHT207']);
        });

        it('test iht paper schema validation when form 207 is chosen, and net value is greater than gross value', (done) => {
            const data = {
                form: 'IHT207',
                grossValueFieldIHT207: 999,
                netValueFieldIHT207: 1000
            };

            testWrapper.testErrors(done, data, 'netValueGreaterThanGross', ['netValueFieldIHT207']);
        });

        it('test iht paper schema validation when form 400 is chosen', (done) => {
            const data = {
                form: 'IHT400421'
            };

            testWrapper.testErrors(done, data, 'required', ['grossValueFieldIHT400421', 'netValueFieldIHT400421']);
        });

        it('test iht paper schema validation when form 400 is chosen, and net value is greater than gross value', (done) => {
            const data = {
                form: 'IHT400421',
                grossValueFieldIHT400421: 999,
                netValueFieldIHT400421: 1000
            };

            testWrapper.testErrors(done, data, 'netValueGreaterThanGross', ['netValueFieldIHT400421']);
        });

        it(`test it redirects to Deceased Alias page: ${expectedNextUrlForDeceasedAlias}`, (done) => {
            const data = {
                form: 'IHT205',
                grossValueFieldIHT205: '100000',
                netValueFieldIHT205: '9999'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedAlias);
        });

    });
});
