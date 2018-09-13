'use strict';

const TestWrapper = require('test/util/TestWrapper');
const sinon = require('sinon');
const when = require('when');
const {assert} = require('chai');
const services = require('app/components/services');
const PinSent = require('app/steps/ui/pin/sent/index');
const commonContent = require('app/resources/en/translation/common');

describe('pin-resend', () => {
    let testWrapper;
    let resendPinStub;
    const expectedNextUrlForPinSent = PinSent.getUrl();
    const sessionData = require('test/data/multipleApplicant');

    beforeEach(() => {
        testWrapper = new TestWrapper('PinResend');
        resendPinStub = sinon.stub(services, 'sendPin');
    });

    afterEach(() => {
        testWrapper.destroy();
        resendPinStub.restore();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test phone number loads on the page', (done) => {
            const contentData = {
                phoneNumber: '07701111111',
            };

            testWrapper.agent
                .post('/prepare-session-field')
                .send({
                    'phoneNumber': '07701111111',
                    'validLink': true
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
                    'leadExecutorName': 'Works',
                    'validLink': true
                })
                .then(function() {
                    testWrapper.testContent(done, ['header1', 'header2'], contentData);
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForPinSent}`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForPinSent);
            resendPinStub.returns(when(Promise.resolve('12345')));
        });

        it('test error page when pin resend fails', (done) => {
            resendPinStub.returns(when(Promise.resolve(new Error('ReferenceError'))));
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.agent.post(testWrapper.pageUrl)
                        .then(response => {
                            assert(response.status === 500);
                            assert(response.text.includes('having technical problems'));
                            assert(resendPinStub.calledOnce, 'Pin resend function called');
                            done();
                        })
                        .catch(err => {
                            done(err);
                        });
                });
        });

        it('test save and close link is not displayed on the page', (done) => {
            const playbackData = {};
            playbackData.saveAndClose = commonContent.saveAndClose;
            playbackData.signOut = commonContent.signOut;

            testWrapper.testContentNotPresent(done, playbackData);
        });
    });
});
