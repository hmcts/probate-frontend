'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ApplicantName = require('app/steps/ui/applicant/name/index');
const AllWholeSiblingsOver18 = require('app/steps/ui/applicant/allwholesiblingsover18/index');
const StopPage = require('app/steps/ui/stoppage/index');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('all-whole-niece-whole-nephew-over-18', () => {
    let testWrapper;
    const expectedNextUrlForApplicantName = ApplicantName.getUrl();
    const expectedNextUrlForAllWholeSiblingsOver18 = AllWholeSiblingsOver18.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('anyoneUnder18');

    beforeEach(() => {
        testWrapper = new TestWrapper('AllWholeNiecesAndWholeNephewsOver18');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('AllWholeNiecesAndWholeNephewsOver18', null, null, [], false, {type: caseTypes.INTESTACY});

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

        it(`test it redirects to Applicant Name page if no niece and nephew are under 18 and no predeceased sibling: /intestacy${expectedNextUrlForApplicantName}`, (done) => {
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
                        allWholeNiecesAndWholeNephewsOver18: 'optionYes',
                        anyPredeceasedWholeSiblings: 'optionYesAll',
                        relationshipToDeceased: 'optionSibling'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForApplicantName}`);
                });
        });

        it(`test it redirects to All whole-sibling over 18 page if no niece or nephew are under 18 and have some predeceased sibling: /intestacy${expectedNextUrlForAllWholeSiblingsOver18}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        allWholeNiecesAndWholeNephewsOver18: 'optionYes',
                        anyPredeceasedWholeSiblings: 'optionYesSome'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForAllWholeSiblingsOver18}`);
                });
        });

        it(`test it redirects to Stop page if any grandchildren are under 18: /intestacy${expectedNextUrlForStopPage}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        allWholeNiecesAndWholeNephewsOver18: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForStopPage}`);
                });
        });
    });
});
