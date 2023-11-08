'use strict';

const TestWrapper = require('test/util/TestWrapper');
const SubmittedToHmrc = require('app/steps/ui/iht/submittedtohmrc');
const ReportEstateValues = require('app/steps/ui/iht/reportestatevalues');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');
const config = require('config');

describe('Tests for IHT Estate Valued', () => {
    let testWrapper;
    const expectedNextUrlSubmittedToHmrc = SubmittedToHmrc.getUrl();
    const expectedNextUrlReportEstateValues = ReportEstateValues.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('IhtEstateValued');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('IhtEstateValued', null, null, [], false, {type: caseTypes.INTESTACY});

        it('test content loaded on the page', (done) => {
            const sessionData = {
                type: caseTypes.GOP,
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                }
            };
            const contentData = {
                ihtThreshold: config.links.ihtThreshold,
                ihtTransferOfThreshold: config.links.ihtTransferOfThreshold,
                ihtNoInheritanceTax: config.links.ihtNoInheritanceTax
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to next page: ${expectedNextUrlSubmittedToHmrc}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.GOP})
                .end(() => {
                    const data = {
                        estateValueCompleted: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlSubmittedToHmrc);
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlReportEstateValues}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.GOP})
                .end(() => {
                    const data = {
                        estateValueCompleted: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlReportEstateValues);
                });
        });
    });
});
