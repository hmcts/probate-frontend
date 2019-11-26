'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedAlias = require('app/steps/ui/deceased/alias');
const testCommonContent = require('test/component/common/testCommonContent.js');

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
        testCommonContent.runTest('IhtPaper');

        it('test content loaded on the page', (done) => {
            const sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            const errorsToTest = ['form'];

            testWrapper.testErrors(done, {}, 'required', errorsToTest);
        });

        it('test iht paper schema validation when form 205 is chosen', (done) => {
            const data = {
                form: 'optionIHT205'
            };
            const errorsToTest = ['grossValueFieldIHT205', 'netValueFieldIHT205'];

            testWrapper.testErrors(done, data, 'required', errorsToTest);
        });

        it('test iht paper schema validation when form 205 is chosen, and net value is greater than gross value', (done) => {
            const data = {
                form: 'optionIHT205',
                grossValueFieldIHT205: 999,
                netValueFieldIHT205: 1000
            };
            const errorsToTest = ['netValueFieldIHT205'];

            testWrapper.testErrors(done, data, 'netValueGreaterThanGross', errorsToTest);
        });

        it('test iht paper schema validation when form 207 is chosen', (done) => {
            const data = {
                form: 'optionIHT207'
            };
            const errorsToTest = ['grossValueFieldIHT207', 'netValueFieldIHT207'];

            testWrapper.testErrors(done, data, 'required', errorsToTest);
        });

        it('test iht paper schema validation when form 207 is chosen, and net value is greater than gross value', (done) => {
            const data = {
                form: 'optionIHT207',
                grossValueFieldIHT207: 999,
                netValueFieldIHT207: 1000
            };
            const errorsToTest = ['netValueFieldIHT207'];

            testWrapper.testErrors(done, data, 'netValueGreaterThanGross', errorsToTest);
        });

        it('test iht paper schema validation when form 400 is chosen', (done) => {
            const data = {
                form: 'optionIHT400421'
            };
            const errorsToTest = ['grossValueFieldIHT400421', 'netValueFieldIHT400421'];

            testWrapper.testErrors(done, data, 'required', errorsToTest);
        });

        it('test iht paper schema validation when form 400 is chosen, and net value is greater than gross value', (done) => {
            const data = {
                form: 'optionIHT400421',
                grossValueFieldIHT400421: 999,
                netValueFieldIHT400421: 1000
            };
            const errorsToTest = ['netValueFieldIHT400421'];

            testWrapper.testErrors(done, data, 'netValueGreaterThanGross', errorsToTest);
        });

        it(`test it redirects to Deceased Alias page: ${expectedNextUrlForDeceasedAlias}`, (done) => {
            const data = {
                form: 'optionIHT205',
                grossValueFieldIHT205: '100000',
                netValueFieldIHT205: '9999'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedAlias);
        });
    });
});
