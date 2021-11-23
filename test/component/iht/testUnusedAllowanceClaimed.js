'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ProbateEstateValues = require('app/steps/ui/iht/probateestatevalues');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('Tests for Unused allowance claimed', () => {
    let testWrapper;
    const expectedNextUrlForProbateEstateValues = ProbateEstateValues.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('IhtUnusedAllowanceClaimed');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('IhtUnusedAllowanceClaimed');

        it('test content loaded on the page', (done) => {
            const sessionData = {
                type: caseTypes.GOP,
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

        it(`test it redirects to next page: ${expectedNextUrlForProbateEstateValues}`, (done) => {
            const data = {
                unusedAllowanceClaimed: 'optionYes'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForProbateEstateValues);
        });
    });
});
