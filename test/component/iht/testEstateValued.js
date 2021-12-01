'use strict';

const TestWrapper = require('test/util/TestWrapper');
const EstateForm = require('app/steps/ui/iht/estateform');
const IhtEstateValues = require('app/steps/ui/iht/ihtestatevalues');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('Tests for IHT Estate Valued', () => {
    let testWrapper;
    const expectedNextUrlIhtEstateForm = EstateForm.getUrl();
    const expectedNextUrlIhtEstateValues = IhtEstateValues.getUrl();

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

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to next page: ${expectedNextUrlIhtEstateForm}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.GOP})
                .end(() => {
                    const data = {
                        estateValueCompleted: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlIhtEstateForm);
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlIhtEstateValues}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.GOP})
                .end(() => {
                    const data = {
                        estateValueCompleted: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlIhtEstateValues);
                });
        });
    });
});
