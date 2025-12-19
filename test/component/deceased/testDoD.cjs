'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedAddress = require('app/steps/ui/deceased/address');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('deceased-dod', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedAddress = DeceasedAddress.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedDod');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('DeceasedDod', null, null, [], false, {type: caseTypes.GOP});

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

        it('test error message displayed for missing data', (done) => {
            const errorsToTest = ['dod-date'];

            testWrapper.testErrors(done, {}, 'required', errorsToTest);
        });

        it('test error message displayed for invalid day', (done) => {
            const errorsToTest = ['dod-day'];
            const data = {'dod-day': '32', 'dod-month': '09', 'dod-year': '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for invalid month', (done) => {
            const errorsToTest = ['dod-month'];
            const data = {'dod-day': '13', 'dod-month': '14', 'dod-year': '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for non-numeric day', (done) => {
            const errorsToTest = ['dod-day'];
            const data = {'dod-day': 'ab', 'dod-month': '09', 'dod-year': '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for non-numeric month', (done) => {
            const errorsToTest = ['dod-month'];
            const data = {'dod-day': '13', 'dod-month': 'ab', 'dod-year': '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for non-numeric year', (done) => {
            const errorsToTest = ['dod-year'];
            const data = {'dod-day': '13', 'dod-month': '12', 'dod-year': '20ab'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for three digits in year field', (done) => {
            const errorsToTest = ['dod-year'];
            const data = {'dod-day': '12', 'dod-month': '9', 'dod-year': '200'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for date in the future', (done) => {
            const errorsToTest = ['dod-date'];
            const sessionData = {
                deceased: {
                    'dob-day': '01',
                    'dob-month': '01',
                    'dob-year': '1945'
                }
            };
            const data = {
                'dod-day': '12',
                'dod-month': '9',
                'dod-year': '3000'
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testErrors(done, data, 'dateInFuture', errorsToTest);
                });
        });

        it('test error message displayed for DoD before DoB', (done) => {
            const errorsToTest = ['dod-date'];
            const sessionData = {
                deceased: {
                    'dob-day': '01',
                    'dob-month': '01',
                    'dob-year': '1945'
                }
            };
            const data = {
                'dod-day': '12',
                'dod-month': '9',
                'dod-year': '1940'
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testErrors(done, data, 'dodBeforeDob', errorsToTest);
                });
        });

        it(`test it redirects to deceased address: ${expectedNextUrlForDeceasedAddress}`, (done) => {
            const data = {
                'dod-day': '01',
                'dod-month': '01',
                'dod-year': '2000'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedAddress);
        });

        it(`test it redirects to deceased dod where dod is same as dob: ${expectedNextUrlForDeceasedAddress}`, (done) => {
            const sessionData = {
                deceased: {
                    'dob-day': '01',
                    'dob-month': '01',
                    'dob-year': '2000'
                }
            };
            const data = {
                'dod-day': '01',
                'dod-month': '01',
                'dod-year': '2000'
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedAddress);
                });
        });
    });
});
