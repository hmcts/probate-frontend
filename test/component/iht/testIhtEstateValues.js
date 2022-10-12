'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedHadLateSpouseOrCivilPartner = require('app/steps/ui/iht/deceasedlatespousecivilpartner');
const ProbateEstateValues = require('app/steps/ui/iht/probateestatevalues');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('Tests for IHT Estate Values', () => {
    let testWrapper;
    const expectedNextUrlDeceasedHadLateSpouseOrCivilPartner = DeceasedHadLateSpouseOrCivilPartner.getUrl();
    const expectedNextUrlProbateEstateValues = ProbateEstateValues.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('IhtEstateValues');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('IhtEstateValues');

        it('test content loaded on the page', (done) => {
            const idsToExclude = ['forEstateIht', 'forEstateProbate'];

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
                    testWrapper.testContent(done, {}, idsToExclude);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to Deceased had a late spouse or civil partner page: ${expectedNextUrlDeceasedHadLateSpouseOrCivilPartner}`, (done) => {
            const data = {
                estateNetValueField: '500000',
                estateGrossValueField: '500000',
                estateNetQualifyingValueField: '500000',
            };

            testWrapper.testRedirect(done, data, expectedNextUrlDeceasedHadLateSpouseOrCivilPartner);
        });

        it(`test it redirects to probate estate values page - qualifying net value < 325,000: ${expectedNextUrlProbateEstateValues}`, (done) => {
            const data = {
                estateNetValueField: '100000',
                estateGrossValueField: '100003',
                estateNetQualifyingValueField: '100000'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlProbateEstateValues);
        });

        it(`test it redirects to probate estate values page - qualifying net value = 0: ${expectedNextUrlProbateEstateValues}`, (done) => {
            const data = {
                estateNetValueField: '1',
                estateGrossValueField: '1',
                estateNetQualifyingValueField: '0'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlProbateEstateValues);
        });

        it(`test it redirects to probate estate values page - qualifying net value > 650,000: ${expectedNextUrlProbateEstateValues}`, (done) => {
            const data = {
                estateNetValueField: '700000',
                estateGrossValueField: '700000',
                estateNetQualifyingValueField: '700000'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlProbateEstateValues);
        });
    });
});
