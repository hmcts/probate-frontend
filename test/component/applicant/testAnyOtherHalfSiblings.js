'use strict';

const TestWrapper = require('test/util/TestWrapper');
const AnyPredeceasedHalfSiblings = require('app/steps/ui/applicant/anypredeceasedhalfsiblings/index');
const ApplicantName = require('app/steps/ui/applicant/name/index');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('any-other-half-siblings', () => {
    let testWrapper;
    const expectedNextUrlForAnyPredeceasedHalfSiblings = AnyPredeceasedHalfSiblings.getUrl();
    const expectedNextUrlForApplicantName = ApplicantName.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('AnyOtherHalfSiblings');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('AnyOtherHalfSiblings', null, null, [], false, {type: caseTypes.INTESTACY});

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
                },
                applicant: {
                    relationshipToDeceased: 'optionChild'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {deceasedName: 'John Doe'};

                    testWrapper.testContent(done, contentData);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to Any Predeceased half-siblings page if deceased had other half-sibling: ${expectedNextUrlForAnyPredeceasedHalfSiblings}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        relationshipToDeceased: 'optionSibling',
                        anyOtherHalfSiblings: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForAnyPredeceasedHalfSiblings);
                });
        });

        it(`test it redirects to Applicant Name page if deceased had no other half-sibling: ${expectedNextUrlForApplicantName}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                applicant: {
                    relationshipToDeceased: 'optionSibling',
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        relationshipToDeceased: 'optionSibling',
                        anyOtherHalfSiblings: 'optionNo',
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForApplicantName);
                });
        });
    });
});
