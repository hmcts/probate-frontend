'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ApplicantExecutor = require('app/steps/ui/applicant/executor/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

describe('iht-value', () => {
    let testWrapper;
    const expectedNextUrlForAppExec = ApplicantExecutor.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('IhtValue');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        testHelpBlockContent.runTest('WillLeft');

        it('test correct iht value page content is loaded', (done) => {
            const contentToExclude = [];

            testWrapper.testContent(done, contentToExclude);
        });

        it('test iht value schema validation when no data is entered', (done) => {
            const errorsToTest = [];
            const data = {};

            testWrapper.testErrors(done, data, 'required', errorsToTest);
        });

        it('test iht value schema validation when invalid data is entered', (done) => {
            const data = {
                'grossValueOnline': 12345,
                'netValueOnline': 123456
            };

            testWrapper.testErrors(done, data, 'netValueGreaterThanGross', ['netValueOnline']);
        });

        it(`test it redirects to applicant executor page: ${expectedNextUrlForAppExec}`, (done) => {
            const data = {
                'grossValueOnline': 123456,
                'netValueOnline': 12345
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForAppExec);
        });

    });
});
