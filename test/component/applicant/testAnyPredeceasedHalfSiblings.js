'use strict';

const TestWrapper = require('test/util/TestWrapper');
const AllHalfSiblingsOver18 = require('app/steps/ui/applicant/allhalfsiblingsover18/index');
const AnySurvivingHalfNiecesAndHalfNephews = require('app/steps/ui/applicant/anysurvivinghalfniecesandhalfnephews/index');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('any-deceased-half-sibling', () => {
    let testWrapper;
    const expectedNextUrlForAllHalfSiblingsOver18 = AllHalfSiblingsOver18.getUrl();
    const expectedNextUrlForAnySurvivingHalfNiecesAndHalfNephews = AnySurvivingHalfNiecesAndHalfNephews.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('AnyPredeceasedHalfSiblings');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('AnyPredeceasedHalfSiblings', null, null, [], false, {type: caseTypes.INTESTACY});

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

        it(`test it redirects to All half-siblings over 18 page if no predeceased half-sibling: /intestacy${expectedNextUrlForAllHalfSiblingsOver18}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        anyPredeceasedHalfSiblings: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForAllHalfSiblingsOver18}`);
                });
        });
        it(`test it redirects to Any surviving half-niece and half-nephew page if only some half-siblings are predeceased: /intestacy${expectedNextUrlForAnySurvivingHalfNiecesAndHalfNephews}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        anyPredeceasedHalfSiblings: 'optionYesAll'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForAnySurvivingHalfNiecesAndHalfNephews}`);
                });
        });
        it(`test it redirects to Any surviving half-niece and half-nephew page if all half-siblings are predeceased: /intestacy${expectedNextUrlForAnySurvivingHalfNiecesAndHalfNephews}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        anyPredeceasedHalfSiblings: 'optionYesSome'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForAnySurvivingHalfNiecesAndHalfNephews}`);
                });
        });
    });
});
