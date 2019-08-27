'use strict';

const TestWrapper = require('test/util/TestWrapper');
const {assert} = require('chai');
const PinSent = require('app/steps/ui/pin/sent');
const commonContent = require('app/resources/en/translation/common');

describe('pin-resend', () => {
    let testWrapper;
    const expectedNextUrlForPinSent = PinSent.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('PinResend');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test uk local phone number loads on the page', (done) => {
            const contentToExclude = ['subHeader2ExecName'];
            const contentData = {
                phoneNumber: '07701111111',
            };

            testWrapper.agent
                .post('/prepare-session-field')
                .send({
                    phoneNumber: '07701111111',
                    validLink: true
                })
                .then(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test uk phone number with int prefix loads on the page', (done) => {
            const contentToExclude = ['subHeader2ExecName'];
            const contentData = {
                phoneNumber: '+447701111111',
            };

            testWrapper.agent
                .post('/prepare-session-field')
                .send({
                    phoneNumber: '+447701111111',
                    validLink: true
                })
                .then(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test international long phone number loads on the page', (done) => {
            const contentToExclude = ['subHeader2ExecName'];
            const contentData = {
                phoneNumber: '+10900111000111000111',
            };

            testWrapper.agent
                .post('/prepare-session-field')
                .send({
                    phoneNumber: '+10900111000111000111',
                    validLink: true
                })
                .then(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test lead executor name loads on the page', (done) => {
            const contentToExclude = ['header1', 'header2'];
            const contentData = {
                executorName: 'Works',
            };

            testWrapper.agent
                .post('/prepare-session-field')
                .send({
                    leadExecutorName: 'Works',
                    validLink: true
                })
                .then(() => {
                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForPinSent}`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForPinSent);
        });

        it('test error page when pin resend fails', (done) => {
            const sessionData = require('test/data/multipleApplicant');
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    delete require.cache[require.resolve('test/data/multipleApplicant')];
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

        it('test "save and close" link is not displayed on the page', (done) => {
            const playbackData = {
                saveAndClose: commonContent.saveAndClose
            };

            testWrapper.testContentNotPresent(done, playbackData);
        });
    });
});
