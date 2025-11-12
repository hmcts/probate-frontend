'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ApplicantName = require('app/steps/ui/applicant/name/index');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');
const testStepName = 'AnyOtherParentAlive';
const testStepUrl = '/any-other-parent-alive';

describe(testStepUrl, () => {
    let testWrapper;
    const expectedNextUrlForApplicantName = ApplicantName.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper(testStepName);
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest(testStepName, null, null, [], false, {type: caseTypes.INTESTACY});

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

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {deceasedName: 'John Doe'};
                    const contentToExclude = ['theDeceased'];

                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to ApplicantName page if No for any Other Parent Alive: ${expectedNextUrlForApplicantName}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        relationshipToDeceased: 'optionGrandchild',
                        anyOtherParentAlive: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForApplicantName);
                });
        });

        it(`est it redirects to ApplicantName page if Yes for any Other Parent Alive: ${expectedNextUrlForApplicantName}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        anyOtherParentAlive: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForApplicantName);
                });
        });
    });
});
