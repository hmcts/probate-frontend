'use strict';

const TestWrapper = require('test/util/TestWrapper');
const {assert} = require('chai');
const CoApplicantStartPage = require('app/steps/ui/coapplicant/startpage');
const commonContent = require('app/resources/en/translation/common');
const config = require('app/config');

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
                        helpHeading1: commonContent.helpHeading1,
                        helpHeading2: commonContent.helpHeading2,
                        helpEmailLabel: commonContent.helpEmailLabel.replace(/{contactEmailAddress}/g, config.links.contactEmailAddress)
                    };
                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test right content loaded on the page', (done) => {
            testWrapper.agent.post('/prepare-session-field/validLink/true')
                .end(() => {
                    testWrapper.testContent(done);
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForCoAppStartPage}`, (done) => {
            const data = {
                pin: '12345',
                formdataId: '12'
            };

            testWrapper.agent
                .post('/prepare-session-field')
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
            testWrapper.agent
                .post('/prepare-session-field/pin/54321')
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

        it('test "save and close" link is not displayed on the page', (done) => {
            const playbackData = {
                saveAndClose: commonContent.saveAndClose
            };

            testWrapper.testContentNotPresent(done, playbackData);
        });
    });
});
