'use strict';

const TestWrapper = require('test/util/TestWrapper');
const SpouseNotApplyingReason = require('app/steps/ui/applicant/spousenotapplyingreason');
const AnyChildren = require('app/steps/ui/deceased/anychildren');
const AnyOtherChildren = require('app/steps/ui/deceased/anyotherchildren');
const AdoptionPlace = require('app/steps/ui/applicant/adoptionplace');
const ApplicantName = require('app/steps/ui/applicant/name');
const StopPage = require('app/steps/ui/stoppage');
const testCommonContent = require('test/component/common/testCommonContent.js');
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

    afterEach(async () => {
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('RelationshipToDeceased', null, null, [], false, {type: caseTypes.INTESTACY});

        it('test content loaded on the page', (done) => {
            const sessionData = {
                type: caseTypes.INTESTACY,
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                deceased: {
                    maritalStatus: 'optionMarried'
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
                    maritalStatus: 'optionMarried'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        relationshipToDeceased: 'optionChild'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForSpouseNotApplyingReason);
                });
        });

        it(`test it redirects to Any Other Children page if relationship is Child and deceased was not married: ${expectedNextUrlForAnyOtherChildren}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionDivorced'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        relationshipToDeceased: 'optionChild'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForAnyOtherChildren);
                });
        });

        it(`test it redirects to Adoption Place page if relationship is Adopted Child: ${expectedNextUrlForAdoptionPlace}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        relationshipToDeceased: 'optionAdoptedChild'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForAdoptionPlace);
                });
        });

        it(`test it redirects to Any Children page if relationship is Spouse/Partner and the estate value is more than the IHT threshold for DoD between 1 Oct 2014 and 5 Feb 2020: ${expectedNextUrlForAnyChildren}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    'dod-date': '2016-05-12',
                    'maritalStatus': 'optionMarried'
                },
                iht: {
                    netValue: 260000
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        relationshipToDeceased: 'optionSpousePartner'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForAnyChildren);
                });
        });

        it(`test it redirects to Any Children page if relationship is Spouse/Partner and the estate value is more than the IHT threshold for DoD after 5 Feb 2020: ${expectedNextUrlForAnyChildren}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    'dod-date': '2020-03-12',
                    'maritalStatus': 'optionMarried'
                },
                iht: {
                    netValue: 280000
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        relationshipToDeceased: 'optionSpousePartner'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForAnyChildren);
                });
        });

        it(`test it redirects to Applicant Name page if relationship is Spouse/Partner and the estate value is less than or equal to the IHT threshold for DoD between 1 Oct 2014 and 5 Feb 2020: ${expectedNextUrlForApplicantName}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    'dod-date': '2016-05-12',
                    'maritalStatus': 'optionMarried'
                },
                iht: {
                    netValue: 240000
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        relationshipToDeceased: 'optionSpousePartner'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForApplicantName);
                });
        });

        it(`test it redirects to Applicant Name page if relationship is Spouse/Partner and the estate value is less than or equal to the IHT threshold for DoD after 5 Feb 2020: ${expectedNextUrlForApplicantName}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    'dod-date': '2020-03-12',
                    'maritalStatus': 'optionMarried'
                },
                iht: {
                    netValue: 260000
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        relationshipToDeceased: 'optionSpousePartner'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForApplicantName);
                });
        });

        it(`test it redirects to Stop page if relationship is Other: ${expectedNextUrlForStopPage}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        relationshipToDeceased: 'optionOther'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
                });
        });
    });
});
