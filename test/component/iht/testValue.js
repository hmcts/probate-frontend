'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedAlias = require('app/steps/ui/deceased/alias');
const testCommonContent = require('test/component/common/testCommonContent.js');

describe('iht-value', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedAlias = DeceasedAlias.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('IhtValue');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('IhtValue');

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
            testWrapper.testErrors(done, {}, 'required');
        });

        it('test iht value schema validation when net value is greater than gross value', (done) => {
            const data = {
                grossValueField: 12345,
                netValueField: 123456
            };
            const errorsToTest = ['netValueField'];

            testWrapper.testErrors(done, data, 'netValueGreaterThanGross', errorsToTest);
        });

        it(`test it redirects to Deceased Alias page: ${expectedNextUrlForDeceasedAlias}`, (done) => {
            const data = {
                grossValueField: 123456,
                netValueField: 12345
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedAlias);
        });
    });
});
