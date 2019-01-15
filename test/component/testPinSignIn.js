'use strict';

const TestWrapper = require('test/util/TestWrapper');
const {assert} = require('chai');
const CoApplicantStartPage = require('app/steps/ui/coapplicant/startpage/index');
const commonContent = require('app/resources/en/translation/common');
const config = require('app/config');
const nock = require('nock');

describe('pin-page', () => {
    let testWrapper;
    const expectedNextUrlForCoAppStartPage = CoApplicantStartPage.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('PinPage');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test help block content is loaded on page', (done) => {
            testWrapper.agent.post('/prepare-session-field/validLink/true')
                .end(() => {
                    const playbackData = {
                        helpTitle: commonContent.helpTitle,
                        helpText: commonContent.helpText,
                        contactTelLabel: commonContent.contactTelLabel.replace('{helpLineNumber}', config.helpline.number),
                        contactOpeningTimes: commonContent.contactOpeningTimes.replace('{openingTimes}', config.helpline.hours),
                        helpEmailLabel: commonContent.helpEmailLabel,
                        contactEmailAddress: commonContent.contactEmailAddress
                    };
                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test right content loaded on the page', (done) => {
            const excludeKeys = [];
            testWrapper.agent.post('/prepare-session-field/validLink/true')
                .end(() => {
                    testWrapper.testContent(done, excludeKeys);
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForCoAppStartPage}`, (done) => {
            const formDataReturnData = {
                formdata: {
                    declaration: {
                        declarationCheckbox: 'Yes'
                    }
                }
            };
            const data = {
                pin: '12345',
                formdataId: '12'
            };

            nock(config.services.persistence.url)
                .get('/12')
                .reply(200, formDataReturnData);

            testWrapper.agent
                .post('/prepare-session-field')
                .send(data)
                .end(() => {
                    testWrapper.testRedirect(done, data, expectedNextUrlForCoAppStartPage);
                });
        });

        it('test error messages displayed for missing data', (done) => {
            const data = {pin: ''};
            testWrapper.testErrors(done, data, 'required', ['pin']);
        });

        it('test error messages displayed for invalid data', (done) => {
            const data = {pin: 'NOT_A_PIN'};
            testWrapper.testErrors(done, data, 'invalid', ['pin']);
        });

        it('test error messages displayed for incorrect pin data', (done) => {
            const data = {pin: '12345'};
            testWrapper.agent
                .post('/prepare-session-field/pin/54321')
                .end(() => {
                    testWrapper.testErrors(done, data, 'incorrect', ['pin']);
                });
        });

        it('test error page when form data cannot be found', (done) => {
            const data = {
                pin: '12345',
                formdataId: '12'
            };

            nock(config.services.persistence.url)
                .get('/12')
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
                            done();
                        })
                        .catch(err => {
                            done(err);
                        });
                });
        });

        it('test save and close link is not displayed on the page', (done) => {
            const playbackData = {
                saveAndClose: commonContent.saveAndClose,
                signOut: commonContent.signOut
            };
            testWrapper.testContentNotPresent(done, playbackData);
        });
    });
});
