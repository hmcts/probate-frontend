'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedAddress = require('app/steps/ui/deceased/address');
const StopPage = require('app/steps/ui/stoppage');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('deceased-details', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedAddress = DeceasedAddress.getUrl();
    const expectedNextUrlForStopPage = StopPage.getUrl('notDiedAfterOctober2014');

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedDetails');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('DeceasedDetails', null, null, [], false, {type: caseTypes.INTESTACY});

        it('test right content loaded on the page', (done) => {
            const sessionData = {
                type: caseTypes.INTESTACY,
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
            const errorsToTest = ['firstName', 'lastName', 'dob-date', 'dod-date'];

            testWrapper.testErrors(done, {}, 'required', errorsToTest);
        });

        it('test errors message displayed for invalid firstName', (done) => {
            const errorsToTest = ['firstName'];
            const data = {
                firstName: '>dee',
                lastName: 'ceased'
            };
            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test errors message displayed for invalid lastName', (done) => {
            const errorsToTest = ['lastName'];
            const data = {
                firstName: 'dee',
                lastName: '>ceased'
            };
            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test errors message displayed for invalid DoB day', (done) => {
            const errorsToTest = ['dob-day'];
            const data = {'dob-day': '32', 'dob-month': '9', 'dob-year': '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test errors message displayed for invalid DoB month', (done) => {
            const errorsToTest = ['dob-month'];
            const data = {'dob-day': '13', 'dob-month': '14', 'dob-year': '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test errors message displayed for non-numeric DoB day', (done) => {
            const errorsToTest = ['dob-day'];
            const data = {'dob-day': 'ab', 'dob-month': '09', 'dob-year': '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test errors message displayed for non-numeric DoB month', (done) => {
            const errorsToTest = ['dob-month'];
            const data = {'dob-day': '13', 'dob-month': 'ab', 'dob-year': '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test errors message displayed for non-numeric DoB year', (done) => {
            const errorsToTest = ['dob-year'];
            const data = {'dob-day': '13', 'dob-month': '12', 'dob-year': '20ab'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test errors message displayed for three digits in DoB year field', (done) => {
            const errorsToTest = ['dob-year'];
            const data = {'dob-day': '12', 'dob-month': '9', 'dob-year': '200'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for DoB in the future', (done) => {
            const errorsToTest = ['dob-date'];
            const data = {
                'firstName': 'Dee',
                'lastName': 'Ceased',
                'dob-day': '12',
                'dob-month': '9',
                'dob-year': '3000',
                'dod-day': '12',
                'dod-month': '9',
                'dod-year': '2018'
            };

            testWrapper.testErrors(done, data, 'dateInFuture', errorsToTest);
        });

        it('test error message displayed for invalid DoD day', (done) => {
            const errorsToTest = ['dod-day'];
            const data = {'dod-day': '32', 'dod-month': '09', 'dod-year': '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for invalid DoD month', (done) => {
            const errorsToTest = ['dod-month'];
            const data = {'dod-day': '13', 'dod-month': '14', 'dod-year': '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for non-numeric DoD day', (done) => {
            const errorsToTest = ['dod-day'];
            const data = {'dod-day': 'ab', 'dod-month': '09', 'dod-year': '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for non-numeric DoD month', (done) => {
            const errorsToTest = ['dod-month'];
            const data = {'dod-day': '13', 'dod-month': 'ab', 'dod-year': '2000'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for non-numeric DoD year', (done) => {
            const errorsToTest = ['dod-year'];
            const data = {'dod-day': '13', 'dod-month': '12', 'dod-year': '20ab'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for three digits in DoD year field', (done) => {
            const errorsToTest = ['dod-year'];
            const data = {'dod-day': '12', 'dod-month': '9', 'dod-year': '200'};

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error message displayed for DoD in the future', (done) => {
            const errorsToTest = ['dod-date'];
            const data = {
                'firstName': 'Dee',
                'lastName': 'Ceased',
                'dob-day': '12',
                'dob-month': '9',
                'dob-year': '2018',
                'dod-day': '12',
                'dod-month': '9',
                'dod-year': '3000'
            };

            testWrapper.testErrors(done, data, 'dateInFuture', errorsToTest);
        });

        it('test error message displayed for DoD before DoB', (done) => {
            const errorsToTest = ['dob-date'];
            const data = {
                'firstName': 'Dee',
                'lastName': 'Ceased',
                'dob-day': '12',
                'dob-month': '9',
                'dob-year': '2015',
                'dod-day': '12',
                'dod-month': '9',
                'dod-year': '2010'
            };

            testWrapper.testErrors(done, data, 'dodBeforeDob', errorsToTest);
        });

        it(`test it redirects to Deceased Address page: ${expectedNextUrlForDeceasedAddress} - DoD after 1 Oct 2014`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        'firstName': 'Bob',
                        'lastName': 'Smith',
                        'dob-day': '12',
                        'dob-month': '9',
                        'dob-year': '2000',
                        'dod-day': '12',
                        'dod-month': '9',
                        'dod-year': '2018'
                    };
                    testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedAddress);
                });
        });

        it(`test it redirects to Deceased Address page: ${expectedNextUrlForDeceasedAddress} - DoD ON 1 Oct 2014`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        'firstName': 'Bob',
                        'lastName': 'Smith',
                        'dob-day': '12',
                        'dob-month': '9',
                        'dob-year': '2000',
                        'dod-day': '1',
                        'dod-month': '10',
                        'dod-year': '2014'
                    };
                    testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedAddress);
                });
        });

        it(`test it redirects to Deceased Address page: ${expectedNextUrlForDeceasedAddress} - DoD equals DoB`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        'firstName': 'Bob',
                        'lastName': 'Smith',
                        'dob-day': '1',
                        'dob-month': '10',
                        'dob-year': '2014',
                        'dod-day': '1',
                        'dod-month': '10',
                        'dod-year': '2014'
                    };
                    testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedAddress);
                });
        });

        it(`test it redirects to stop page: ${expectedNextUrlForStopPage} - DoD ON 30 Sep 2014`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        'firstName': 'Bob',
                        'lastName': 'Smith',
                        'dob-day': '12',
                        'dob-month': '9',
                        'dob-year': '2000',
                        'dod-day': '30',
                        'dod-month': '9',
                        'dod-year': '2014'
                    };
                    testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
                });
        });

        it(`test it redirects to stop page: ${expectedNextUrlForStopPage} - DoD before 30 Sep 2014`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        'firstName': 'Bob',
                        'lastName': 'Smith',
                        'dob-day': '12',
                        'dob-month': '9',
                        'dob-year': '2000',
                        'dod-day': '12',
                        'dod-month': '9',
                        'dod-year': '2014'
                    };
                    testWrapper.testRedirect(done, data, expectedNextUrlForStopPage);
                });
        });
    });
});
