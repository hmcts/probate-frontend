'use strict';

const TestWrapper = require('test/util/TestWrapper');
const AllWholeNiecesAndWholeNephewsOver18 = require('app/steps/ui/applicant/allwholeniecesandwholenephewsover18/index');
const AllWholeSiblingsOver18 = require('app/steps/ui/applicant/allwholesiblingsover18/index');
const ApplicantName = require('app/steps/ui/applicant/name/index');
const AnyOtherHalfSiblings = require('app/steps/ui/applicant/anyotherhalfsiblings/index');
const testCommonContent = require('test/component/common/testCommonContent.js');
const StopPage = require('app/steps/ui/stoppage/index');
const caseTypes = require('app/utils/CaseTypes');

describe('any-surviving-whole-niece-whole-nephew', () => {
    let testWrapper;
    const expectedNextUrlForAllWholeNiecesAndWholeNephewsOver18 = AllWholeNiecesAndWholeNephewsOver18.getUrl();
    const expectedNextUrlForAllWholeSiblingsOver18 = AllWholeSiblingsOver18.getUrl();
    const expectedNextUrlForApplicantName = ApplicantName.getUrl();
    const expectedNextUrlForAnyOtherHalfSiblings = AnyOtherHalfSiblings.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('hasSurvivingChildrenWithOneParent');

    beforeEach(() => {
        testWrapper = new TestWrapper('AnySurvivingWholeNiecesAndWholeNephews');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('AnySurvivingWholeNiecesAndWholeNephews', null, null, [], false, {type: caseTypes.INTESTACY});

        it('test content loaded on the page', (done) => {
            const sessionData = {
                type: caseTypes.INTESTACY,
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                deceased: {
                    'firstName': 'John',
                    'lastName': 'Doe',
                    'dod-day': 13,
                    'dod-month': 10,
                    'dod-year': 2018,
                    'dod-formattedDate': '13 October 2018'
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

        it(`test it redirects to whole-niece and whole-nephew page if surviving children are there: ${expectedNextUrlForAllWholeNiecesAndWholeNephewsOver18}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        anySurvivingWholeNiecesAndWholeNephews: 'optionYes',
                        anyPredeceasedWholeSiblings: 'optionYesAll',
                        sameParents: 'optionBothParentsSame'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForAllWholeNiecesAndWholeNephewsOver18);
                });
        });
        it(`test it redirects to whole-niece and whole-nephew page if surviving children are there: ${expectedNextUrlForAllWholeNiecesAndWholeNephewsOver18}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        anySurvivingWholeNiecesAndWholeNephews: 'optionYes',
                        anyPredeceasedWholeSiblings: 'optionYesSome',
                        sameParents: 'optionBothParentsSame'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForAllWholeNiecesAndWholeNephewsOver18);
                });
        });
        it(`test it redirects to whole sibling over 18 page if some whole-siblings are predeceased: ${expectedNextUrlForAllWholeSiblingsOver18}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        anyPredeceasedWholeSiblings: 'optionYesSome',
                        anySurvivingWholeNiecesAndWholeNephews: 'optionNo',
                        sameParents: 'optionBothParentsSame'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForAllWholeSiblingsOver18);
                });
        });
        it(`test it redirects to Applicant name page if all whole-sibling are predeceased: ${expectedNextUrlForApplicantName}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                applicant: {
                    relationshipToDeceased: 'optionSibling'
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        anyPredeceasedWholeSiblings: 'optionYesAll',
                        anySurvivingWholeNiecesAndWholeNephews: 'optionNo',
                        sameParents: 'optionBothParentsSame',
                        relationshipToDeceased: 'optionSibling'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForApplicantName);
                });
        });

        it(`test it redirects to Any other half-siblings page if all whole-sibling are predeceased and only one parent is common: ${expectedNextUrlForAnyOtherHalfSiblings}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                applicant: {
                    relationshipToDeceased: 'optionSibling'
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        anyPredeceasedWholeSiblings: 'optionYesAll',
                        anySurvivingWholeNiecesAndWholeNephews: 'optionNo',
                        sameParents: 'optionOneParentsSame',
                        relationshipToDeceased: 'optionSibling'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForAnyOtherHalfSiblings);
                });
        });
        it(`test it redirects to stop page if all whole-sibling are predeceased and only one parent in common: ${expectedNextUrlForStopPage}`, (done) => {
            const sessionData = {
                caseType: caseTypes.INTESTACY,
                applicant: {
                    relationshipToDeceased: 'optionSibling'
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        anyPredeceasedWholeSiblings: 'optionYesAll',
                        anySurvivingWholeNiecesAndWholeNephews: 'optionYes',
                        sameParents: 'optionOneParentsSame',
                        relationshipToDeceased: 'optionSibling'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
                });
        });
    });
});
