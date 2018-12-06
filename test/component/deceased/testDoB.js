'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedDod = require('app/steps/ui/deceased/dod/index');
const DeceasedDomicile = require('app/steps/ui/deceased/domicile/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

const nock = require('nock');
const config = require('app/config');
const featureToggleUrl = config.featureToggles.url;
const featureTogglePath = `${config.featureToggles.path}/${config.featureToggles.screening_questions}`;

describe('deceased-dob', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedDomicile = DeceasedDomicile.getUrl();
    const expectedNextUrlForDeceasedDod = DeceasedDod.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedDob');
    });

    afterEach(() => {
        testWrapper.destroy();
        nock.cleanAll();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('DeceasedDob');

        it('test right content loaded on the page', (done) => {
            testWrapper.testContent(done, []);
        });

        it('test errors message displayed for missing data', (done) => {
            const errorsToTest = ['dob_day', 'dob_month', 'dob_year'];
            const data = {};

            testWrapper.testErrors(done, data, 'required', errorsToTest);
        });

        it('test errors message displayed for invalid day', (done) => {
            const errorsToTest = ['dob_day'];
            const data = {dob_day: '32', dob_month: '9', dob_year: '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test errors message displayed for invalid month', (done) => {
            const errorsToTest = ['dob_month'];
            const data = {dob_day: '13', dob_month: '14', dob_year: '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test errors message displayed for non-numeric day', (done) => {
            const errorsToTest = ['dob_day'];
            const data = {dob_day: 'ab', dob_month: '09', dob_year: '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test errors message displayed for non-numeric month', (done) => {
            const errorsToTest = ['dob_month'];
            const data = {dob_day: '13', dob_month: 'ab', dob_year: '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test errors message displayed for non-numeric year', (done) => {
            const errorsToTest = ['dob_year'];
            const data = {dob_day: '13', dob_month: '12', dob_year: '20ab'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test errors message displayed for three digits in year field', (done) => {
            const errorsToTest = ['dob_year'];
            const data = {dob_day: '12', dob_month: '9', dob_year: '200'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for date in the future', (done) => {
            const errorsToTest = ['dob_date'];
            const data = {
                dob_day: '12',
                dob_month: '9',
                dob_year: '3000'
            };

            testWrapper.testErrors(done, data, 'dateInFuture', errorsToTest);
        });

        it('test error message displayed for DoD before DoB', (done) => {
            const errorsToTest = ['dob_date'];
            const sessionData = {
                deceased: {
                    dod_day: '01',
                    dod_month: '01',
                    dod_year: '2000'
                }
            };
            const data = {
                dob_day: '12',
                dob_month: '9',
                dob_year: '2002'
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testErrors(done, data, 'dodBeforeDob', errorsToTest);
                });
        });

        it(`test it redirects to deceased domicile page: ${expectedNextUrlForDeceasedDomicile}`, (done) => {
            nock(featureToggleUrl)
                .get(featureTogglePath)
                .reply(200, 'false');

            const data = {
                dob_day: '01',
                dob_month: '01',
                dob_year: '1999'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedDomicile);
        });

        it(`test it redirects to deceased dod: ${expectedNextUrlForDeceasedDod}`, (done) => {
            nock(featureToggleUrl)
                .get(featureTogglePath)
                .reply(200, 'true');

            const data = {
                dob_day: '01',
                dob_month: '01',
                dob_year: '1999'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedDod);
        });
    });
});
