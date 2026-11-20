'use strict';

const TestWrapper = require('test/util/TestWrapper');
const AnyPredeceasedWholeSiblings = require('app/steps/ui/applicant/anypredeceasedwholesiblings/index');
const ApplicantName = require('app/steps/ui/applicant/name/index');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('any-other-whole-siblings', () => {
    let testWrapper;
    const expectedNextUrlForAnyPredeceasedWholeSiblings = AnyPredeceasedWholeSiblings.getUrl();
    const expectedNextUrlForApplicantName = ApplicantName.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('AnyOtherWholeSiblings');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('AnyOtherWholeSiblings', null, null, [], false, {type: caseTypes.INTESTACY});

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

        it(`test it redirects to Any Predeceased whole-siblings page if deceased had other whole-sibling: /intestacy${expectedNextUrlForAnyPredeceasedWholeSiblings}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        relationshipToDeceased: 'optionSibling',
                        anyOtherWholeSiblings: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForAnyPredeceasedWholeSiblings}`);
                });
        });

        it(`test it redirects to Applicant Name page if deceased had no other whole-sibling: /intestacy${expectedNextUrlForApplicantName}`, (done) => {
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
                        anyOtherWholeSiblings: 'optionNo',
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForApplicantName}`);
                });
        });
    });
});
