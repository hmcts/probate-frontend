'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ApplicantName = require('app/steps/ui/applicant/name/index');
const StopPage = require('app/steps/ui/stoppage/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');
const content = require('app/resources/en/translation/deceased/anygrandchildrenunder18');
const caseTypes = require('app/utils/CaseTypes');

describe('any-grandchildren-under-18', () => {
    let testWrapper;
    const expectedNextUrlForApplicantName = ApplicantName.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('grandchildrenUnder18');

    beforeEach(() => {
        testWrapper = new TestWrapper('AnyGrandchildrenUnder18');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('AnyGrandchildrenUnder18');

        it('test content loaded on the page', (done) => {
            const sessionData = {
                deceased: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {deceasedName: 'John Doe'};
                    testWrapper.testContent(done, [], contentData);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required', []);
        });

        it(`test it redirects to Applicant Name page if no grandchildren are under 18: ${expectedNextUrlForApplicantName}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        anyGrandchildrenUnder18: content.optionNo
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForApplicantName);
                });
        });

        it(`test it redirects to Stop page if any grandchildren are under 18: ${expectedNextUrlForStopPage}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        anyGrandchildrenUnder18: content.optionYes
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
                });
        });
    });
});
