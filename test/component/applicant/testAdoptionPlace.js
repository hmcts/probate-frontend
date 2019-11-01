'use strict';

const TestWrapper = require('test/util/TestWrapper');
const SpouseNotApplyingReason = require('app/steps/ui/applicant/spousenotapplyingreason');
const AnyOtherChildren = require('app/steps/ui/deceased/anyotherchildren');
const StopPage = require('app/steps/ui/stoppage');
const testCommonContent = require('test/component/common/testCommonContent.js');
const content = require('app/resources/en/translation/applicant/adoptionplace');
const contentMaritalStatus = require('app/resources/en/translation/deceased/maritalstatus');
const caseTypes= require('app/utils/CaseTypes');

describe('adoption-place', () => {
    let testWrapper;
    const expectedNextUrlForSpouseNotApplyingReason = SpouseNotApplyingReason.getUrl();
    const expectedNextUrlForAnyOtherChildren = AnyOtherChildren.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('adoptionNotEnglandOrWales');

    beforeEach(() => {
        testWrapper = new TestWrapper('AdoptionPlace');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('AdoptionPlace');

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

        it(`test it redirects to Spouse Not Applying Reason page if adoption took place in England or Wales and deceased was married: ${expectedNextUrlForSpouseNotApplyingReason}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: contentMaritalStatus.optionMarried
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        adoptionPlace: content.optionYes
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForSpouseNotApplyingReason);
                });
        });

        it(`test it redirects to Any Other Children page if adoption took place in England or Wales and deceased was not married: ${expectedNextUrlForAnyOtherChildren}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: contentMaritalStatus.optionDivorced
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        adoptionPlace: content.optionYes
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForAnyOtherChildren);
                });
        });

        it(`test it redirects to Stop page if adoption took place outside England or Wales: ${expectedNextUrlForStopPage}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        adoptionPlace: content.optionNo
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
                });
        });
    });
});
