'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ApplicantExecutor = require('app/steps/ui/applicant/executor/index');
const StopPage = require('app/steps/ui/stoppage/index');
const json = require('app/resources/en/translation/deceased/domicile.json');

describe('deceased-domicile', () => {
    let testWrapper;
    const expectedNextUrlForApplicantExecutor = ApplicantExecutor.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('notInEnglandOrWales');

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedDomicile');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test right content loaded on the page', (done) => {
            testWrapper.testContent(done, []);
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required', []);
        });

        it(`test it redirects to applicant executor if person lived inside england or wales: ${expectedNextUrlForApplicantExecutor}`, (done) => {
            const data = {
                domicile: json.optionYes
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForApplicantExecutor);
        });

        it(`test it redirects to stop page if person lived outside england and wales: ${expectedNextUrlForStopPage}`, (done) => {
            const data = {
                domicile: json.optionNo
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
        });
    });
});
