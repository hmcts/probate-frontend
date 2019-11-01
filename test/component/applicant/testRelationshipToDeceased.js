'use strict';

const TestWrapper = require('test/util/TestWrapper');
const SpouseNotApplyingReason = require('app/steps/ui/applicant/spousenotapplyingreason');
const AnyChildren = require('app/steps/ui/deceased/anychildren');
const AnyOtherChildren = require('app/steps/ui/deceased/anyotherchildren');
const AdoptionPlace = require('app/steps/ui/applicant/adoptionplace');
const ApplicantName = require('app/steps/ui/applicant/name');
const StopPage = require('app/steps/ui/stoppage');
const testCommonContent = require('test/component/common/testCommonContent.js');
const content = require('app/resources/en/translation/applicant/relationshiptodeceased');
const contentMaritalStatus = require('app/resources/en/translation/deceased/maritalstatus');
const caseTypes = require('app/utils/CaseTypes');

describe('relationship-to-deceased', () => {
    let testWrapper;
    const expectedNextUrlForSpouseNotApplyingReason = SpouseNotApplyingReason.getUrl();
    const expectedNextUrlForAnyChildren = AnyChildren.getUrl();
    const expectedNextUrlForAnyOtherChildren = AnyOtherChildren.getUrl();
    const expectedNextUrlForAdoptionPlace = AdoptionPlace.getUrl();
    const expectedNextUrlForApplicantName = ApplicantName.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('otherRelationship');

    beforeEach(() => {
        testWrapper = new TestWrapper('RelationshipToDeceased');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('RelationshipToDeceased');

        it('test content loaded on the page', (done) => {
            const sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                deceased: {
                    maritalStatus: contentMaritalStatus.optionMarried
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

        it(`test it redirects to Spouse Not Applying Reason page if relationship is Child and deceased was married: ${expectedNextUrlForSpouseNotApplyingReason}`, (done) => {
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
                        relationshipToDeceased: content.optionChild
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForSpouseNotApplyingReason);
                });
        });

        it(`test it redirects to Any Other Children page if relationship is Child and deceased was not married: ${expectedNextUrlForAnyOtherChildren}`, (done) => {
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
                        relationshipToDeceased: content.optionChild
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForAnyOtherChildren);
                });
        });

        it(`test it redirects to Adoption Place page if relationship is Adopted Child: ${expectedNextUrlForAdoptionPlace}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        relationshipToDeceased: content.optionAdoptedChild
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForAdoptionPlace);
                });
        });

        it(`test it redirects to Any Children page if relationship is Spouse/Partner and the estate value is > £250k: ${expectedNextUrlForAnyChildren}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: contentMaritalStatus.optionMarried
                },
                iht: {
                    netValue: 450000
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        relationshipToDeceased: content.optionSpousePartner
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForAnyChildren);
                });
        });

        it(`test it redirects to Applicant Name page if relationship is Spouse/Partner and the estate value is <= £250k: ${expectedNextUrlForApplicantName}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: contentMaritalStatus.optionMarried
                },
                iht: {
                    netValue: 200000
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        relationshipToDeceased: content.optionSpousePartner
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForApplicantName);
                });
        });

        it(`test it redirects to Stop page if relationship is Other: ${expectedNextUrlForStopPage}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        relationshipToDeceased: content.optionOther
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
                });
        });
    });
});
