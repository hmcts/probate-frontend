'use strict';

const TestWrapper = require('test/util/TestWrapper');
const {assert} = require('chai');
const PinSent = require('app/steps/ui/pin/sent/index');
const commonContent = require('app/resources/en/translation/common');
const nock = require('nock');
const config = require('app/config');
const businessServiceUrl = config.services.validation.url.replace('/validate', '');

describe('pin-resend', () => {
    let testWrapper;
    const expectedNextUrlForPinSent = PinSent.getUrl();
    const sessionData = require('test/data/multipleApplicant');

    beforeEach(() => {
        testWrapper = new TestWrapper('PinResend');
    });

    afterEach(() => {
        nock.cleanAll();
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test uk local phone number loads on the page', (done) => {
            const contentData = {
                phoneNumber: '07701111111',
            };
            testWrapper.agent
                .post('/prepare-session-field')
                .send({
                    phoneNumber: '07701111111',
                    validLink: true
                })
                .then(function() {
                    testWrapper.testContent(done, ['subHeader2ExecName'], contentData);
                });
        });

        it('test uk phone number with int prefix loads on the page', (done) => {
            const contentData = {
                phoneNumber: '+447701111111',
            };
            testWrapper.agent
                .post('/prepare-session-field')
                .send({
                    phoneNumber: '+447701111111',
                    validLink: true
                })
                .then(function() {
                    testWrapper.testContent(done, ['subHeader2ExecName'], contentData);
                });
        });

        it('test international long phone number loads on the page', (done) => {
            const contentData = {
                phoneNumber: '+10900111000111000111',
            };
            testWrapper.agent
                .post('/prepare-session-field')
                .send({
                    phoneNumber: '+10900111000111000111',
                    validLink: true
                })
                .then(function() {
                    testWrapper.testContent(done, ['subHeader2ExecName'], contentData);
                });
        });

        it('test lead executor name loads on the page', (done) => {
            const contentData = {
                executorName: 'Works',
            };
            testWrapper.agent
                .post('/prepare-session-field')
                .send({
                    leadExecutorName: 'Works',
                    validLink: true
                })
                .then(function() {
                    testWrapper.testContent(done, ['header1', 'header2'], contentData);
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForPinSent}`, (done) => {
            nock(businessServiceUrl)
                .get('/pin?phoneNumber=undefined')
                .reply(200, '12345');

            testWrapper.testRedirect(done, {}, expectedNextUrlForPinSent);
        });

        it('test error page when pin resend fails', (done) => {
            nock(businessServiceUrl)
                .get('/pin?phoneNumber=undefined')
                .reply(500, new Error('ReferenceError'));

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.agent.post(testWrapper.pageUrl)
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
