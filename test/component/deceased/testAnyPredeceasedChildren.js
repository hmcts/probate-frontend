'use strict';

const TestWrapper = require('test/util/TestWrapper');
const AllChildrenOver18 = require('app/steps/ui/deceased/allchildrenover18/index');
const AnySurvivingGrandchildren = require('app/steps/ui/deceased/anysurvivinggrandchildren/index');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('any-deceased-children', () => {
    let testWrapper;
    const expectedNextUrlForAllChildrenOver18 = AllChildrenOver18.getUrl();
    const expectedNextUrlForAnySurvivingGrandchildren = AnySurvivingGrandchildren.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('AnyPredeceasedChildren');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('AnyPredeceasedChildren', null, null, [], false, {type: caseTypes.INTESTACY});

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

        it(`test it redirects to All children over 18 page if no predeceased children: ${expectedNextUrlForAllChildrenOver18}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        anyPredeceasedChildren: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForAllChildrenOver18);
                });
        });
        it(`test it redirects to Any surviving grandchildren page if some children are predeceased: ${expectedNextUrlForAnySurvivingGrandchildren}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        anyPredeceasedChildren: 'optionYesAll'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForAnySurvivingGrandchildren);
                });
        });
        it(`test it redirects to Any surviving grandchildren page if all children are predeceased: ${expectedNextUrlForAnySurvivingGrandchildren}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        anyPredeceasedChildren: 'optionYesSome'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForAnySurvivingGrandchildren);
                });
        });
    });
});
