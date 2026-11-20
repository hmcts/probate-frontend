'use strict';

const TestWrapper = require('test/util/TestWrapper');
const AllWholeSiblingsOver18 = require('app/steps/ui/applicant/allwholesiblingsover18/index');
const AnySurvivingWholeNiecesAndWholeNephews = require('app/steps/ui/applicant/anysurvivingwholeniecesandwholenephews/index');
const testCommonContent = require('test/component/common/testCommonContent.js');
const StopPage = require('app/steps/ui/stoppage/index');
const caseTypes = require('app/utils/CaseTypes');

describe('any-deceased-whole-sibling', () => {
    let testWrapper;
    const expectedNextUrlForAllWholeSiblingsOver18 = AllWholeSiblingsOver18.getUrl();
    const expectedNextUrlForAnySurvivingWholeNiecesAndWholeNephews = AnySurvivingWholeNiecesAndWholeNephews.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('hasOtherSiblingsWithSameParents');

    beforeEach(() => {
        testWrapper = new TestWrapper('AnyPredeceasedWholeSiblings');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('AnyPredeceasedWholeSiblings', null, null, [], false, {type: caseTypes.INTESTACY});

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
            const contentToExclude = ['theDeceased'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {deceasedName: 'John Doe'};

                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to All whole-siblings over 18 page if no predeceased whole-sibling: /intestacy${expectedNextUrlForAllWholeSiblingsOver18}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        anyPredeceasedWholeSiblings: 'optionNo',
                        sameParents: 'optionBothParentsSame'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForAllWholeSiblingsOver18}`);
                });
        });

        it(`test it redirects to stop page if no predeceased whole-sibling and only one parent is common: /intestacy${expectedNextUrlForStopPage}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        anyPredeceasedWholeSiblings: 'optionNo',
                        sameParents: 'optionOneParentsSame'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForStopPage}`);
                });
        });

        it(`test it redirects to stop page if some predeceased whole-sibling and only one parent is common: /intestacy${expectedNextUrlForStopPage}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        anyPredeceasedWholeSiblings: 'optionYesSome',
                        sameParents: 'optionOneParentsSame'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForStopPage}`);
                });
        });
        it(`test it redirects to Any surviving niece and nephew page if all whole-siblings are predeceased: /intestacy${expectedNextUrlForAnySurvivingWholeNiecesAndWholeNephews}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        anyPredeceasedWholeSiblings: 'optionYesAll',
                        sameParents: 'optionBothParentsSame'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForAnySurvivingWholeNiecesAndWholeNephews}`);
                });
        });
        it(`test it redirects to Any surviving niece and nephew page if all whole-siblings are predeceased: /intestacy${expectedNextUrlForAnySurvivingWholeNiecesAndWholeNephews}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        anyPredeceasedWholeSiblings: 'optionYesAll',
                        sameParents: 'optionOneParentsSame'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForAnySurvivingWholeNiecesAndWholeNephews}`);
                });
        });
        it(`test it redirects to Any surviving niece and nephew page if some whole-siblings are predeceased: /intestacy${expectedNextUrlForAnySurvivingWholeNiecesAndWholeNephews}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        anyPredeceasedWholeSiblings: 'optionYesSome',
                        sameParents: 'optionBothParentsSame'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForAnySurvivingWholeNiecesAndWholeNephews}`);
                });
        });
    });
});
