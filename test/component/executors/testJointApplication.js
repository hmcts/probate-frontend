'use strict';

const TestWrapper = require('test/util/TestWrapper');
const CoApplicantRelationship = require('app/steps/ui/executors/relationshiptodeceased');
const ApplicantName = require('app/steps/ui/applicant/name');
const Equality = require('app/steps/ui/equality');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('joint-application', () => {
    let testWrapper, sessionData;
    const expectedNextUrlForCoApplicantRelationship = CoApplicantRelationship.getUrl('*');
    const expectedNextUrlForEquality = Equality.getUrl();
    const expectedNextUrlForApplicantNameUrl = ApplicantName.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('JointApplication');
        sessionData = {
            type: caseTypes.INTESTACY,
            ccdCase: {
                state: 'Pending',
                id: 1234567890123456
            },
            deceased: {
                firstName: 'John',
                lastName: 'Doe'
            },
            applicant: {
                'firstName': 'Bobby',
                'lastName': 'Applicant',
                'isApplying': true,
                'isApplicant': true,
                'fullName': 'Bobby Applicant',
                relationshipToDeceased: 'optionChild'
            },
            executors: {
                list: []
            }
        };
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('JointApplication', null, null, [], false, {type: caseTypes.INTESTACY});

        it('test redirection to relationship page when selecting yes with multiple executors', (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionMarried'
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {hasCoApplicant: 'optionYes',
                        hasCoApplicantChecked: 'true',
                        list: [
                            {firstName: 'John', lastName: 'TheApplicant', isApplying: true, isApplicant: true},
                        ]};

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForCoApplicantRelationship}`);
                });
        });

        it('test redirection to equality page when selecting no', (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionMarried'
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {list: [{'fullName': 'Jeff Exec Two', 'isApplying': true}],
                        hasCoApplicant: 'optionNo',
                        hasCoApplicantChecked: true};

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForEquality}`);
                });
        });

        it('test redirection to stop page when relationship to deceased is spouse and they want to do joint application', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionMarried'
                },
                applicant: {
                    relationshipToDeceased: 'optionSpousePartner'
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {list: [{'fullName': 'Jeff Exec Two', 'isApplying': true}],
                        hasCoApplicant: 'optionYes',
                        hasCoApplicantChecked: true};

                    testWrapper.testRedirect(done, data, '/intestacy/stop-page/noJointApplicationApplicable');
                });
        });

        it('test redirection to Applicant name when selecting no', (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionMarried'
                },
                applicant: {
                    relationshipToDeceased: 'optionSpousePartner'
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {list: [{'fullName': 'Jeff Exec Two', 'isApplying': true}],
                        hasCoApplicant: 'optionNo',
                        hasCoApplicantChecked: true};

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForApplicantNameUrl}`);
                });
        });

        it('test correct content loaded on the page', (done) => {
            const contentToExclude = ['titleParent', 'questionParent', 'paragraph1Parent', 'paragraph2Parent', 'paragraph3Parent', 'paragraph1Spouse', 'paragraph2Spouse', 'paragraph4Spouse'];
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        deceasedName: 'John Doe'
                    };
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });
        it('test correct content loaded on the page for relationshipToDeceased is Parent', (done) => {
            const contentToExclude = ['title', 'question', 'paragraph1', 'paragraph2', 'paragraph3', 'applicantExecutor', 'paragraph1Spouse', 'paragraph2Spouse', 'paragraph4Spouse'];
            sessionData.applicant.relationshipToDeceased = 'optionParent';
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        deceasedName: 'John Doe'
                    };
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });
        it('test correct content loaded on the page for relationshipToDeceased is spouse', (done) => {
            const contentToExclude = ['paragraph1', 'paragraph2', 'paragraph3', 'applicantExecutor', 'paragraph1Spouse', 'paragraph2Spouse', 'paragraph4Spouse', 'titleParent', 'questionParent', 'paragraph1Parent', 'paragraph2Parent', 'paragraph3Parent'];
            sessionData.applicant.relationshipToDeceased = 'optionSpousePartner';
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        deceasedName: 'John Doe'
                    };
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test errors message displayed for required data', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {hasCoApplicantChecked: 'false'};
                    testWrapper.testErrors(done, data, 'required');
                });
        });
    });
});
