'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ApplicantName = require('app/steps/ui/applicant/name/index');
const AllHalfSiblingsOver18 = require('app/steps/ui/applicant/allhalfsiblingsover18/index');
const StopPage = require('app/steps/ui/stoppage/index');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('all-half-niece-half-nephew-over-18', () => {
    let testWrapper;
    const expectedNextUrlForApplicantName = ApplicantName.getUrl();
    const expectedNextUrlForAllHalfSiblingsOver18 = AllHalfSiblingsOver18.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('anyoneUnder18');

    beforeEach(() => {
        testWrapper = new TestWrapper('AllHalfNiecesAndHalfNephewsOver18');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('AllHalfNiecesAndHalfNephewsOver18', null, null, [], false, {type: caseTypes.INTESTACY});

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

                    testWrapper.testContent(done, contentData);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to Applicant Name page if no half-niece and half-nephew are under 18 and no predeceased half-sibling: ${expectedNextUrlForApplicantName}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                applicant: {
                    relationshipToDeceased: 'optionChild'
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        allHalfNiecesAndHalfNephewsOver18: 'optionYes',
                        anyPredeceasedHalfSiblings: 'optionYesAll',
                        relationshipToDeceased: 'optionSibling'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForApplicantName);
                });
        });

        it(`test it redirects to All half-sibling over 18 page if no half niece or nephew are under 18 and have some predeceased half-sibling: ${expectedNextUrlForAllHalfSiblingsOver18}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        allHalfNiecesAndHalfNephewsOver18: 'optionYes',
                        anyPredeceasedHalfSiblings: 'optionYesSome'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForAllHalfSiblingsOver18);
                });
        });

        it(`test it redirects to Stop page if any grandchildren are under 18: ${expectedNextUrlForStopPage}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        allHalfNiecesAndHalfNephewsOver18: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
                });
        });
    });
});
