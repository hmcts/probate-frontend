'use strict';

const TestWrapper = require('test/util/TestWrapper');
const {assert} = require('chai');
const ExecutorsAdditionalInviteSent = require('app/steps/ui/executors/additionalinvitesent/index');
const nock = require('nock');
const config = require('app/config');
const businessServiceUrl = config.services.validation.url.replace('/validate', '');

describe('executors-additional-invite', () => {
    let testWrapper;
    let sessionData;
    const expectedNextUrlForExecutorsAdditionalInviteSent = ExecutorsAdditionalInviteSent.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorsAdditionalInvite');
        sessionData = require('test/data/executors-invites');
    });

    afterEach(() => {
        testWrapper.destroy();
        delete require.cache[require.resolve('test/data/executors-invites')];
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test correct content loaded on the page when only 1 other executor has been added and needs to be emailed', (done) => {
            sessionData.executors.executorsToNotifyList = [
                {fullName: 'Andrew Wiles', isApplying: true, emailSent: false},
            ];
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, ['header-multiple']);
                });
        });

        it('test correct content loaded on the page when more than 1 other executor has been added and needs to be emailed', (done) => {
            sessionData.executors.executorsToNotifyList = [
                {fullName: 'Andrew Wiles', isApplying: true, emailSent: false},
                {fullName: 'Leonhard Euler', isApplying: true, emailSent: false}
            ];
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, ['header']);
                });
        });

        it('test content displays only the executors who have been added and need to be emailed', (done) => {
            sessionData.executors.executorsToNotifyList = [
                {fullName: 'Andrew Wiles', isApplying: true, emailSent: false},
                {fullName: 'Leonhard Euler', isApplying: true, emailSent: false}
            ];
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.agent.get(testWrapper.pageUrl)
                        .then(response => {
                            assert(response.text.includes('Andrew Wiles'));
                            assert(response.text.includes('Leonhard Euler'));
                            done();
                        });
                });
        });

        it('test content displays only the single executor who has had their email changed', (done) => {
            sessionData.executors.executorsToNotifyList = [
                {fullName: 'Andrew Wiles', isApplying: true, emailSent: false},
            ];
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.agent.get(testWrapper.pageUrl)
                        .then(response => {
                            assert(response.text.includes('Andrew Wiles'));
                            done();
                        });
                });
        });

        it('test an error page is rendered if there is an error calling invite service', (done) => {
            nock(businessServiceUrl)
                .post('/invite')
                .reply(500, new Error('ReferenceError'));

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.agent.post(testWrapper.pageUrl)
                        .then(response => {
                            assert(response.status === 500);
                            assert(response.text.includes('Sorry, we&rsquo;re having technical problems'));
                            done();
                        })
                        .catch(err => {
                            done(err);
                        });
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForExecutorsAdditionalInviteSent}`, (done) => {
            nock(businessServiceUrl)
                .post('/invite')
                .reply(200, {response: 'Make it pass!'});

            const data = {};
            sessionData.executors.executorsToNotifyList = [
                {fullName: 'Andrew Wiles', isApplying: true, emailSent: false},
            ];
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testRedirect(done, data, expectedNextUrlForExecutorsAdditionalInviteSent);
                });
        });
    });
});
