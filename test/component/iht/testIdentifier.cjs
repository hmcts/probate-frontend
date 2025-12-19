'use strict';

const TestWrapper = require('test/util/TestWrapper.cjs');
const IhtValue = require('app/steps/ui/iht/value');
const testCommonContent = require('test/component/common/testCommonContent.cjs');

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
        testCommonContent.runTest('IhtIdentifier');

        it('test correct iht identifier page content is loaded', (done) => {
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

        it('test iht identifier schema validation when no input is entered', (done) => {
            testWrapper.testErrors(done, {}, 'required');
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
