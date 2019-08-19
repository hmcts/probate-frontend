'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ExecutorAddress = require('app/steps/ui/executors/address');
const commonContent = require('app/resources/en/translation/common');
const config = require('app/config');
const webchatFeatureTogglePath = `${config.featureToggles.path}/${config.featureToggles.webchat}`;
const webformsFeatureTogglePath = `${config.featureToggles.path}/${config.featureToggles.webforms}`;
const nock = require('nock');
const featureToggleUrl = config.featureToggles.url;

const featureTogglesNockWebchat = (status = 'true') => {
    nock(featureToggleUrl)
        .get(webchatFeatureTogglePath)
        .reply(200, status);
};
const featureTogglesNockWebforms = (status = 'true') => {
    nock(featureToggleUrl)
        .get(webformsFeatureTogglePath)
        .reply(200, status);
};

describe('executors-contact-details', () => {
    let testWrapper, sessionData;
    const expectedNextUrlForExecAddress = ExecutorAddress.getUrl(1);

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorContactDetails');
        sessionData = {
            applicant: {
                firstName: 'John',
                lastName: 'TheApplicant'
            },
            executors: {
                executorsNumber: 3,
                list: [
                    {fullName: 'John', isApplying: true, isApplicant: true},
                    {fullName: 'Other Applicant', isApplying: true, isApplicant: true},
                    {fullName: 'Harvey', isApplying: true, isApplicant: true}
                ]
            }
        };
    });

    afterEach(() => {
        testWrapper.destroy();
        nock.cleanAll();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test help block content is loaded on page', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const playbackData = {
                        helpTitle: commonContent.helpTitle,
                        helpHeadingTelephone: commonContent.helpHeadingTelephone,
                        helpHeadingEmail: commonContent.helpHeadingEmail,
                        helpEmailLabel: commonContent.helpEmailLabel.replace(/{contactEmailAddress}/g, config.links.contactEmailAddress)
                    };

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test webchat help block content is loaded on page', (done) => {
            featureTogglesNockWebchat();

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const playbackData = {
                        helpHeadingWebchat: commonContent.helpHeadingWebchat,
                    };

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test webforms help block content is loaded on page', (done) => {
            featureTogglesNockWebforms();

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const playbackData = {
                        helpHeadingOnlineForm: commonContent.helpHeadingOnlineForm,
                        sendUsAMessage: commonContent.sendUsAMessage.replace('{webForms}', config.links.webForms),
                        opensInNewWindow: commonContent.opensInNewWindow,
                        responseTime: commonContent.responseTime
                    };

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test correct content is loaded on the page', (done) => {
            const excludeKeys = [];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        executorName: 'Other Applicant'
                    };
                    testWrapper.testContent(done, excludeKeys, contentData);
                });
        });

        it('test error messages displayed if no data entered', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const errorsToTest = ['email', 'mobile'];
                    const data = {
                        index: 1,
                        email: '',
                        mobile: ''
                    };
                    testWrapper.testErrors(done, data, 'required', errorsToTest);
                });
        });

        it('test error messages displayed if no email entered', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        index: 1,
                        executorName: 'Other Applicant',
                        email: '',
                        mobile: '07336622022'
                    };
                    testWrapper.testErrors(done, data, 'required', ['email']);
                });
        });

        it('test error messages displayed if no mobile number entered', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        index: 1,
                        executorName: 'Other Applicant',
                        email: 'test@hotmail.com',
                        mobile: ''
                    };
                    testWrapper.testErrors(done, data, 'required', ['mobile']);
                });
        });

        it('test error messages displayed if invalid email entered', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        index: 1,
                        executorName: 'Other Applicant',
                        email: 'test@.com',
                        mobile: '+447663382082'
                    };
                    testWrapper.testErrors(done, data, 'invalid', ['email']);
                });
        });

        it('test error messages displayed if invalid mobile number entered', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        index: 1,
                        executorName: 'Other Applicant',
                        email: 'test@hotmail.com',
                        mobile: '+rr53t6463'
                    };
                    testWrapper.testErrors(done, data, 'invalid', ['mobile']);
                });
        });

        it('test error messages displayed if invalid data entered', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        index: 1,
                        executorName: 'Other Applicant',
                        email: 'b@.m',
                        mobile: '075r5r5r5r'
                    };
                    testWrapper.testErrors(done, data, 'invalid');
                });
        });

        it(`test it redirects to address page: ${expectedNextUrlForExecAddress}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        executorName: 'Other Applicant',
                        email: 'test@hotmail.com',
                        mobile: '+447663382082'
                    };
                    testWrapper.testRedirect(done, data, expectedNextUrlForExecAddress);
                });
        });
    });
});
