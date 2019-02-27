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

        it('test correct iht paper page content is loaded', (done) => {
            const contentToExclude = [];

            testWrapper.testContent(done, contentToExclude);
        });

        it('test iht paper schema validation when no data is entered', (done) => {
            const errorsToTest = ['form'];
            const data = {};

            testWrapper.testErrors(done, data, 'required', errorsToTest);
        });

        it('test iht paper schema validation when form 205 is chosen', (done) => {
            const data = {
                form: 'IHT205'
            };

            testWrapper.testErrors(done, data, 'required', ['grossIHT205', 'netIHT205']);
        });

        it('test iht paper schema validation when form 205 is chosen, and net value is greater than gross value', (done) => {
            const data = {
                form: 'IHT205',
                grossIHT205: 999,
                netIHT205: 1000
            };

            testWrapper.testErrors(done, data, 'netValueGreaterThanGross', ['netIHT205']);
        });

        it('test iht paper schema validation when form 207 is chosen', (done) => {
            const data = {
                form: 'IHT207'
            };

            testWrapper.testErrors(done, data, 'required', ['grossIHT207', 'netIHT207']);
        });

        it('test iht paper schema validation when form 207 is chosen, and net value is greater than gross value', (done) => {
            const data = {
                form: 'IHT207',
                grossIHT207: 999,
                netIHT207: 1000
            };

            testWrapper.testErrors(done, data, 'netValueGreaterThanGross', ['netIHT207']);
        });

        it('test iht paper schema validation when form 400 is chosen', (done) => {
            const data = {
                form: 'IHT400421'
            };

            testWrapper.testErrors(done, data, 'required', ['grossIHT400421', 'netIHT400421']);
        });

        it('test iht paper schema validation when form 400 is chosen, and net value is greater than gross value', (done) => {
            const data = {
                form: 'IHT400421',
                grossIHT400421: 999,
                netIHT400421: 1000
            };

            testWrapper.testErrors(done, data, 'netValueGreaterThanGross', ['netIHT400421']);
        });

        it(`test it redirects to Deceased Alias page: ${expectedNextUrlForDeceasedAlias}`, (done) => {
            const data = {
                form: 'IHT205',
                grossIHT205: '100000',
                netIHT205: '9999'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedAlias);
        });

    });
});
