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

        testHelpBlockContent.runTest('WillLeft');

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
                form: '205'
            };

            testWrapper.testErrors(done, data, 'required', ['gross205', 'net205']);
        });

        it('test iht paper schema validation when form 205 is chosen, and net value is greater than gross value', (done) => {
            const data = {
                form: '205',
                gross205: 999,
                net205: 1000
            };

            testWrapper.testErrors(done, data, 'netValueGreaterThanGross', ['net205']);
        });

        it('test iht paper schema validation when form 207 is chosen', (done) => {
            const data = {
                form: '207'
            };

            testWrapper.testErrors(done, data, 'required', ['gross207', 'net207']);
        });

        it('test iht paper schema validation when form 207 is chosen, and net value is greater than gross value', (done) => {
            const data = {
                form: '207',
                gross207: 999,
                net207: 1000
            };

            testWrapper.testErrors(done, data, 'netValueGreaterThanGross', ['net207']);
        });

        it('test iht paper schema validation when form 400 is chosen', (done) => {
            const data = {
                form: '400'
            };

            testWrapper.testErrors(done, data, 'required', ['gross400', 'net400']);
        });

        it('test iht paper schema validation when form 400 is chosen, and net value is greater than gross value', (done) => {
            const data = {
                form: '400',
                gross400: 999,
                net400: 1000
            };

            testWrapper.testErrors(done, data, 'netValueGreaterThanGross', ['net400']);
        });

        it(`test it redirects to Deceased Alias page: ${expectedNextUrlForDeceasedAlias}`, (done) => {
            const data = {
                form: '205',
                'gross205': '100000',
                'net205': '9999'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedAlias);
        });

    });
});
