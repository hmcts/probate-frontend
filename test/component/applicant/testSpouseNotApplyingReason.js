'use strict';

const TestWrapper = require('test/util/TestWrapper');
const AdoptedIn = require('app/steps/ui/applicant/adoptedin/index');
const ChildAlive = require('app/steps/ui/deceased/deceasedchildalive/index');
const StopPage = require('app/steps/ui/stoppage/index');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');
const config = require('config');

describe('spouse-not-applying-reason', () => {
    let testWrapper;
    const expectedNextUrlForAdoptedIn = AdoptedIn.getUrl();
    const expectedNextUrlForParentAlive = ChildAlive.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('spouseNotApplying');

    beforeEach(() => {
        testWrapper = new TestWrapper('SpouseNotApplyingReason');
    });

    afterEach(async () => {
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('SpouseNotApplyingReason', null, null, [], false, {type: caseTypes.INTESTACY});

        it('test content loaded on the page', (done) => {
            const sessionData = {
                type: caseTypes.INTESTACY,
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                deceased: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            };
            const contentToExclude = ['theDeceased'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {deceasedName: 'John Doe',
                        spouseGivingUpAdminRightsPA16Link: config.links.spouseGivingUpAdminRightsPA16Link};
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to Adopted in page if spouse renouncing and child is applying: /intestacy${expectedNextUrlForAdoptedIn}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        spouseNotApplyingReason: 'optionRenouncing',
                        relationshipToDeceased: 'optionChild'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForAdoptedIn}`);
                });
        });

        it(`test it redirects to Parent alive page if spouse renouncing and grandchild is applying: /intestacy${expectedNextUrlForParentAlive}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        spouseNotApplyingReason: 'optionRenouncing',
                        relationshipToDeceased: 'optionGrandchild'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForParentAlive}`);
                });
        });

        it(`test it redirects to Any Other Children page if spouse not applying for other reasons: /intestacy${expectedNextUrlForStopPage}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        spouseNotApplyingReason: 'optionOther'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForStopPage}`);
                });
        });
    });
});
