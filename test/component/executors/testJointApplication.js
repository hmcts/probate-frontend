'use strict';

const TestWrapper = require('test/util/TestWrapper');
const CoApplicantRelationship = require('app/steps/ui/executors/relationshiptodeceased');
const Equality = require('app/steps/ui/equality');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('joint-application', () => {
    let testWrapper, sessionData;
    const expectedNextUrlForCoApplicantRelationship = CoApplicantRelationship.getUrl('*');
    const expectedNextUrlForEquality = Equality.getUrl();

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

                    testWrapper.testRedirect(done, data, expectedNextUrlForCoApplicantRelationship);
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

                    testWrapper.testRedirect(done, data, expectedNextUrlForEquality);
                });
        });

        it('test correct content loaded on the page', (done) => {
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
                    const data = {hasCoApplicantChecked: 'false'};
                    testWrapper.testErrors(done, data, 'required');
                });
        });
    });
});
