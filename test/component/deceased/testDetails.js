'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedAddress = require('app/steps/ui/deceased/address/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');
const config = require('app/config');
const nock = require('nock');
const featureToggleUrl = config.featureToggles.url;
const intestacyQuestionsFeatureTogglePath = `${config.featureToggles.path}/${config.featureToggles.intestacy_questions}`;
const featureTogglesNock = (status = 'true') => {
    nock(featureToggleUrl)
        .get(intestacyQuestionsFeatureTogglePath)
        .reply(200, status);
};

describe('deceased-details', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedAddress = DeceasedAddress.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedDetails');
        featureTogglesNock();
    });

    afterEach(() => {
        testWrapper.destroy();
        nock.cleanAll();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('DeceasedDetails', featureTogglesNock);

        it('test right content loaded on the page', (done) => {
            testWrapper.testContent(done, []);
        });

        it('test errors message displayed for missing data', (done) => {
            const errorsToTest = ['firstName', 'lastName', 'dob_day', 'dob_month', 'dob_year', 'dod_day', 'dod_month', 'dod_year'];
            const data = {};

            testWrapper.testErrors(done, data, 'required', errorsToTest);
        });

        it('test errors message displayed for invalid firstName', (done) => {
            const errorsToTest = ['firstName'];
            const data = {
                firstName: '<dee',
                lastName: 'ceased'
            };
            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test errors message displayed for invalid lastName', (done) => {
            const errorsToTest = ['lastName'];
            const data = {
                firstName: 'dee',
                lastName: '<ceased'
            };
            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test errors message displayed for invalid DoB day', (done) => {
            const errorsToTest = ['dob_day'];
            const data = {dob_day: '32', dob_month: '9', dob_year: '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test errors message displayed for invalid DoB month', (done) => {
            const errorsToTest = ['dob_month'];
            const data = {dob_day: '13', dob_month: '14', dob_year: '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test errors message displayed for non-numeric DoB day', (done) => {
            const errorsToTest = ['dob_day'];
            const data = {dob_day: 'ab', dob_month: '09', dob_year: '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test errors message displayed for non-numeric DoB month', (done) => {
            const errorsToTest = ['dob_month'];
            const data = {dob_day: '13', dob_month: 'ab', dob_year: '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test errors message displayed for non-numeric DoB year', (done) => {
            const errorsToTest = ['dob_year'];
            const data = {dob_day: '13', dob_month: '12', dob_year: '20ab'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test errors message displayed for three digits in DoB year field', (done) => {
            const errorsToTest = ['dob_year'];
            const data = {dob_day: '12', dob_month: '9', dob_year: '200'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for DoB in the future', (done) => {
            const errorsToTest = ['dob_date'];
            const data = {
                firstName: 'Dee',
                lastName: 'Ceased',
                dob_day: '12',
                dob_month: '9',
                dob_year: '3000',
                dod_day: '12',
                dod_month: '9',
                dod_year: '2018'
            };

            testWrapper.testErrors(done, data, 'dateInFuture', errorsToTest);
        });

        it('test error message displayed for invalid DoD day', (done) => {
            const errorsToTest = ['dod_day'];
            const data = {dod_day: '32', dod_month: '09', dod_year: '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for invalid DoD month', (done) => {
            const errorsToTest = ['dod_month'];
            const data = {dod_day: '13', dod_month: '14', dod_year: '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for non-numeric DoD day', (done) => {
            const errorsToTest = ['dod_day'];
            const data = {dod_day: 'ab', dod_month: '09', dod_year: '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for non-numeric DoD month', (done) => {
            const errorsToTest = ['dod_month'];
            const data = {dod_day: '13', dod_month: 'ab', dod_year: '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for non-numeric DoD year', (done) => {
            const errorsToTest = ['dod_year'];
            const data = {dod_day: '13', dod_month: '12', dod_year: '20ab'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for three digits in DoD year field', (done) => {
            const errorsToTest = ['dod_year'];
            const data = {dod_day: '12', dod_month: '9', dod_year: '200'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for DoD in the future', (done) => {
            const errorsToTest = ['dod_date'];
            const data = {
                firstName: 'Dee',
                lastName: 'Ceased',
                dob_day: '12',
                dob_month: '9',
                dob_year: '2018',
                dod_day: '12',
                dod_month: '9',
                dod_year: '3000'
            };

            testWrapper.testErrors(done, data, 'dateInFuture', errorsToTest);
        });

        it('test error message displayed for DoD before DoB', (done) => {
            const errorsToTest = ['dob_date'];
            const data = {
                firstName: 'Dee',
                lastName: 'Ceased',
                dob_day: '12',
                dob_month: '9',
                dob_year: '2015',
                dod_day: '12',
                dod_month: '9',
                dod_year: '2010'
            };

            testWrapper.testErrors(done, data, 'dodBeforeDob', errorsToTest);
        });

        it(`test it redirects to Deceased Address page: ${expectedNextUrlForDeceasedAddress}`, (done) => {
            testWrapper.agent.post('/prepare-session-field/willLeft/No')
                .end(() => {
                    const data = {
                        firstName: 'Bob',
                        lastName: 'Smith',
                        dob_day: '12',
                        dob_month: '9',
                        dob_year: '2000',
                        dod_day: '12',
                        dod_month: '9',
                        dod_year: '2018'
                    };
                    testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedAddress);
                });
        });
    });
});
