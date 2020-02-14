'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ExecutorsWithOtherNames = require('app/steps/ui/executors/othername');
const ExecutorContactDetails = require('app/steps/ui/executors/contactdetails');
const testCommonContent = require('test/component/common/testCommonContent.js');

describe('executors-alias', () => {
    let testWrapper;
    const expectedNextUrlForExecOtherNames = ExecutorsWithOtherNames.getUrl();
    const expectedNextUrlForExecContactDetails = ExecutorContactDetails.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorsAlias');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ExecutorsAlias');

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

        it(`test it redirects to Executor Other Names when Yes: ${expectedNextUrlForExecOtherNames}`, (done) => {
            const data = {
                alias: 'optionYes'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForExecOtherNames);
        });

        it(`test it redirects to Executor Contact Details when No: ${expectedNextUrlForExecContactDetails}`, (done) => {
            const data = {
                alias: 'optionNo'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForExecContactDetails);
        });
    });
});
