'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedDod = require('app/steps/ui/deceased/dod');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('deceased-dob', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedDod = DeceasedDod.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedDob');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('DeceasedDob', null, null, [], false, {type: caseTypes.GOP});

        it('test right content loaded on the page', (done) => {
            const sessionData = {
                type: caseTypes.GOP,
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            const errorsToTest = ['dob-date'];

            testWrapper.testErrors(done, {}, 'required', errorsToTest);
        });

        it('test errors message displayed for invalid day', (done) => {
            const errorsToTest = ['dob-day'];
            const data = {'dob-day': '32', 'dob-month': '9', 'dob-year': '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test errors message displayed for invalid month', (done) => {
            const errorsToTest = ['dob-month'];
            const data = {'dob-day': '13', 'dob-month': '14', 'dob-year': '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test errors message displayed for non-numeric day', (done) => {
            const errorsToTest = ['dob-day'];
            const data = {'dob-day': 'ab', 'dob-month': '09', 'dob-year': '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test errors message displayed for non-numeric month', (done) => {
            const errorsToTest = ['dob-month'];
            const data = {'dob-day': '13', 'dob-month': 'ab', 'dob-year': '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test errors message displayed for non-numeric year', (done) => {
            const errorsToTest = ['dob-year'];
            const data = {'dob-day': '13', 'dob-month': '12', 'dob-year': '20ab'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test errors message displayed for three digits in year field', (done) => {
            const errorsToTest = ['dob-year'];
            const data = {'dob-day': '12', 'dob-month': '9', 'dob-year': '200'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for date in the future', (done) => {
            const errorsToTest = ['dob-date'];
            const data = {
                'dob-day': '12',
                'dob-month': '9',
                'dob-year': '3000'
            };

            testWrapper.testErrors(done, data, 'dateInFuture', errorsToTest);
        });

        it('test error message displayed for DoD before DoB', (done) => {
            const errorsToTest = ['dob-date'];
            const sessionData = {
                deceased: {
                    'dod-day': '01',
                    'dod-month': '01',
                    'dod-year': '2000'
                }
            };
            const data = {
                'dob-day': '12',
                'dob-month': '9',
                'dob-year': '2002'
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testErrors(done, data, 'dodBeforeDob', errorsToTest);
                });
        });

        it(`test it redirects to deceased dod: ${expectedNextUrlForDeceasedDod}`, (done) => {
            const data = {
                'dob-day': '01',
                'dob-month': '01',
                'dob-year': '1999'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedDod);
        });

        it(`test it redirects to deceased dod where dod is same as dob: ${expectedNextUrlForDeceasedDod}`, (done) => {
            const sessionData = {
                deceased: {
                    'dod-day': '01',
                    'dod-month': '01',
                    'dod-year': '2000'
                }
            };
            const data = {
                'dob-day': '01',
                'dob-month': '01',
                'dob-year': '2000'
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedDod);
                });
        });
    });
});
