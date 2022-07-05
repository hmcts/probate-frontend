'use strict';

const TestWrapper = require('test/util/TestWrapper');
const {assert} = require('chai');
const CoApplicantStartPage = require('app/steps/ui/coapplicant/startpage');
const commonContent = require('app/resources/en/translation/common');
const config = require('config');
const nock = require('nock');
const S2S_URL = config.services.idam.s2s_url;
const IDAM_URL = config.services.idam.apiUrl;

describe('pin-page', () => {
    let testWrapper;
    const expectedNextUrlForCoAppStartPage = CoApplicantStartPage.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('PinPage');
    });

    afterEach(() => {
        nock.cleanAll();
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test help block content is loaded on page', (done) => {
            const sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.agent.post('/prepare-session-field/validLink/true')
                        .end(() => {
                            const playbackData = {
                                helpTitle: commonContent.helpTitle,
                                helpHeading1: commonContent.helpHeading1,
                                helpHeading2: commonContent.helpHeading2,
                                helpHeading3: commonContent.helpHeading3,
                                helpTelephoneNumber: commonContent.helpTelephoneNumber,
                                helpTelephoneOpeningHoursTitle: commonContent.helpTelephoneOpeningHoursTitle,
                                helpTelephoneOpeningHours1: commonContent.helpTelephoneOpeningHours1,
                                helpTelephoneOpeningHours2: commonContent.helpTelephoneOpeningHours2,
                                helpEmailLabel: commonContent.helpEmailLabel.replace(/{contactEmailAddress}/g, commonContent.helpEmail)
                            };

                            testWrapper.testDataPlayback(done, playbackData);
                        });
                });
        });

        it('test right content loaded on the page', (done) => {
            const sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.agent.post('/prepare-session-field/validLink/true')
                        .end(() => {
                            testWrapper.testContent(done);
                        });
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForCoAppStartPage}`, (done) => {
            const formDataReturnData = {
                declaration: {
                    declarationCheckbox: 'true'
                }
            };
            const data = {
                pin: '12345',
                formdataId: '12',
                caseType: 'gop'
            };

            nock(config.services.orchestrator.url)
                .get('/forms/case/12?probateType=PA')
                .reply(200, formDataReturnData);

            nock(S2S_URL).post('/lease')
                .reply(200, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJSRUZFUkVOQ0UifQ.Z_YYn0go02ApdSMfbehsLXXbxJxLugPG' +
                    '8v_3ktCpQurK8tHkOy1qGyTo02bTdilX4fq4M5glFh80edDuhDJXPA');

            nock(IDAM_URL).post('/oauth2/authorize')
                .reply(200, {code: '12345'});

            nock(IDAM_URL).post('/oauth2/token')
                .reply(200, {'access_token': 'sdkfhdskhf'});

            testWrapper.agent.post('/prepare-session-field')
                .send(data)
                .end(() => {
                    testWrapper.testRedirect(done, data, expectedNextUrlForCoAppStartPage);
                });
        });

        it('test error messages displayed for missing data', (done) => {
            const data = {pin: ''};
            const errorsToTest = ['pin'];

            testWrapper.testErrors(done, data, 'required', errorsToTest);
        });

        it('test error messages displayed for invalid data', (done) => {
            const data = {pin: 'NOT_A_PIN'};
            const errorsToTest = ['pin'];

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test error messages displayed for incorrect pin data', (done) => {
            const data = {pin: '12345'};
            testWrapper.agent.post('/prepare-session-field/pin/54321')
                .end(() => {
                    const errorsToTest = ['pin'];

                    testWrapper.testErrors(done, data, 'incorrect', errorsToTest);
                });
        });

        it('test error page when form data cannot be found', (done) => {
            const data = {
                pin: '12345',
                formdataId: '12'
            };

            nock(S2S_URL)
                .post('/lease')
                .reply(200, 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJSRUZFUkVOQ0UifQ.Z_YYn0go02ApdSMfbehsLXXbxJxLugPG' +
                    '8v_3ktCpQurK8tHkOy1qGyTo02bTdilX4fq4M5glFh80edDuhDJXPA');

            nock(IDAM_URL)
                .post('/oauth2/authorize')
                .reply(200, {code: '12345'});

            nock(IDAM_URL)
                .post('/oauth2/token')
                .reply(200, {'access_token': 'sdkfhdskhf'});

            nock(config.services.orchestrator.url)
                .get('/forms/12')
                .reply(200, new Error('ReferenceError'));

            testWrapper.agent
                .post('/prepare-session-field')
                .send(data)
                .end(() => {
                    testWrapper.agent
                        .post(testWrapper.pageUrl)
                        .send({pin: '12345'})
                        .then(response => {
                            assert(response.status === 500);
                            assert(response.text.includes('having technical problems'));
                            nock.cleanAll();
                            done();
                        })
                        .catch(err => {
                            nock.cleanAll();
                            done(err);
                        });
                });
        });

        it('test "save and close", "my applications" and "sign out" links are not displayed on the page', (done) => {
            const playbackData = {
                saveAndClose: commonContent.saveAndClose,
                myApplications: commonContent.myApplications,
                signOut: commonContent.signOut
            };

            testWrapper.testContentNotPresent(done, playbackData);
        });
    });
});
