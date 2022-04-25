'use strict';

const TestWrapper = require('test/util/TestWrapper');
const IhtUnusedAllowanceClaimed = require('app/steps/ui/iht/unusedallowanceclaimed');
const ProbateEstateValues = require('app/steps/ui/iht/probateestatevalues');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('Tests for IHT Estate Valued', () => {
    let testWrapper;
    const expectedNextUrlForIhtUnusedAllowanceClaimed = IhtUnusedAllowanceClaimed.getUrl();
    const expectedNextUrlForProbateEstateValues = ProbateEstateValues.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedHadLateSpouseOrCivilPartner');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('DeceasedHadLateSpouseOrCivilPartner');

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

        it(`test it redirects to next page: ${expectedNextUrlForIhtUnusedAllowanceClaimed}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.GOP})
                .end(() => {
                    const data = {
                        deceasedHadLateSpouseOrCivilPartner: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForIhtUnusedAllowanceClaimed);
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForProbateEstateValues}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.GOP})
                .end(() => {
                    const data = {
                        deceasedHadLateSpouseOrCivilPartner: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForProbateEstateValues);
                });
        });
    });
});
