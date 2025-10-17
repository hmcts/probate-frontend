'use strict';

const TestWrapper = require('test/util/TestWrapper');
const CoApplicantName = require('app/steps/ui/executors/coapplicantname');
const ParentDieBefore = require('app/steps/ui/executors/parentdiebefore');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('coapplicant-relationship-to-deceased', () => {
    let testWrapper, sessionData;
    const expectedNextUrlForCoApplicantName = CoApplicantName.getUrl(1);

    const expectedNextUrlForParentDieBefore = ParentDieBefore.getUrl(1);

    beforeEach(() => {
        testWrapper = new TestWrapper('CoApplicantRelationshipToDeceased');
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
                'fullName': 'Bobby Applicant'
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
        testCommonContent.runTest('CoApplicantRelationshipToDeceased', null, null, [], false, {type: caseTypes.INTESTACY});

        it('test redirection to coApplicant name page when relationship to deceased is child', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
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
                        coApplicantRelationshipToDeceased: 'optionChild',
                        list: [
                            {firstName: 'John', lastName: 'TheApplicant', isApplying: true, isApplicant: true},
                        ]};

                    testWrapper.testRedirect(done, data, expectedNextUrlForCoApplicantName);
                });
        });

        it('test redirection to Parent die before page when relationship to deceased is Grandchild', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
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
                        coApplicantRelationshipToDeceased: 'optionGrandchild',};

                    testWrapper.testRedirect(done, data, expectedNextUrlForParentDieBefore);
                });
        });

        it('test redirection to stop page when relationship to deceased is others', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
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
                        coApplicantRelationshipToDeceased: 'optionOther'};

                    testWrapper.testRedirect(done, data, '/stop-page/otherCoApplicantRelationship');
                });
        });

        it('test correct content loaded on the page', (done) => {
            sessionData.deceasedName = 'John Doe';
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        deceasedName: 'John Doe'
                    };
                    testWrapper.testContent(done, contentData);
                });
        });

        it('test errors message displayed for required data', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        deceasedName: 'John Doe',
                    };
                    testWrapper.testErrors(done, data, 'required');
                });
        });
    });
});
