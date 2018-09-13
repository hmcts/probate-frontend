'use strict';

const TestWrapper = require('test/util/TestWrapper');
const sinon = require('sinon');
const when = require('when');
const {assert} = require('chai');
const services = require('app/components/services');
const CoApplicantStartPage = require('app/steps/ui/coapplicant/startpage/index');
const commonContent = require('app/resources/en/translation/common');

describe('pin-page', () => {
    let testWrapper;
    let loadFormDataStub;
    const expectedNextUrlForCoAppStartPage = CoApplicantStartPage.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('PinPage');
        loadFormDataStub = sinon.stub(services, 'loadFormData');
    });

    afterEach(() => {
        testWrapper.destroy();
        loadFormDataStub.restore();

    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test right content loaded on the page', (done) => {
            const excludeKeys = [];
            testWrapper.agent.post('/prepare-session-field/validLink/true')
                .end(() => {
                    testWrapper.testContent(done, excludeKeys);
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForCoAppStartPage}`, (done) => {
            loadFormDataStub.returns(when(Promise.resolve({formdata: {declaration: {}}})));
            const data = {pin: '12345'};
            testWrapper.agent.post('/prepare-session-field/pin/12345')
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
            testWrapper.agent.post('/prepare-session-field/pin/54321')
                .end(() => {
                    testWrapper.testErrors(done, data, 'incorrect', ['pin']);
            });
        });
        it('test error page when form data cannot be found', (done) => {

            loadFormDataStub.returns(when(Promise.resolve(new Error('ReferenceError'))));
            testWrapper.agent.post('/prepare-session-field/pin/12345')
                .end(() => {
                    testWrapper.agent.post(testWrapper.pageUrl)
                        .send({pin: '12345'})
                        .then(response => {
                            assert(response.status === 500);
                            assert(response.text.includes('having technical problems'));
                            assert(loadFormDataStub.calledOnce, 'Form data function called');
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
