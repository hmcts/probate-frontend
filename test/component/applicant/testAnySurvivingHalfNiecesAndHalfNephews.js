'use strict';

const TestWrapper = require('test/util/TestWrapper');
const AllHalfNiecesAndHalfNephewsOver18 = require('app/steps/ui/applicant/allhalfniecesandhalfnephewsover18/index');
const AllHalfSiblingsOver18 = require('app/steps/ui/applicant/allhalfsiblingsover18/index');
const ApplicantName = require('app/steps/ui/applicant/name/index');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('any-surviving-half-niece-half-nephew', () => {
    let testWrapper;
    const expectedNextUrlForAllHalfNiecesAndHalfNephewsOver18 = AllHalfNiecesAndHalfNephewsOver18.getUrl();
    const expectedNextUrlForAllHalfSiblingsOver18 = AllHalfSiblingsOver18.getUrl();
    const expectedNextUrlForApplicantName = ApplicantName.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('AnySurvivingHalfNiecesAndHalfNephews');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('AnySurvivingHalfNiecesAndHalfNephews', null, null, [], false, {type: caseTypes.INTESTACY});

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

        it(`test it redirects to half-niece and half-nephew page if surviving children are there: /intestacy${expectedNextUrlForAllHalfNiecesAndHalfNephewsOver18}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        anySurvivingHalfNiecesAndHalfNephews: 'optionYes'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForAllHalfNiecesAndHalfNephewsOver18}`);
                });
        });
        it(`test it redirects to grandchild over 18 page if some half-siblings are predeceased: /intestacy${expectedNextUrlForAllHalfSiblingsOver18}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        anyPredeceasedHalfSiblings: 'optionYesSome',
                        anySurvivingHalfNiecesAndHalfNephews: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForAllHalfSiblingsOver18}`);
                });
        });
        it(`test it redirects to Applicant name page if all half-sibling are predeceased: /intestacy${expectedNextUrlForApplicantName}`, (done) => {
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
                        anyPredeceasedHalfSiblings: 'optionYesAll',
                        anySurvivingHalfNiecesAndHalfNephews: 'optionNo',
                        relationshipToDeceased: 'optionSibling'
                    };

                    testWrapper.testRedirect(done, data, `/intestacy${expectedNextUrlForApplicantName}`);
                });
        });
    });
});
