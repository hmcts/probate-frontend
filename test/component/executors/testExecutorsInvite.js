'use strict';

const TestWrapper = require('test/util/TestWrapper');
const services = require('app/components/services');
const sinon = require('sinon');
const when = require('when');
const {assert} = require('chai');
const ExecutorsInvitesSent = require('app/steps/ui/executors/invitesent/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

describe('executors-invite', () => {
    let testWrapper;
    let sendInvitesStub;
    let sessionData;
    const expectedNextUrlForExecInvites = ExecutorsInvitesSent.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorsInvite');
        sessionData = require('test/data/executors-invites');
        sendInvitesStub = sinon.stub(services, 'sendInvite');
    });

    afterEach(() => {
        testWrapper.destroy();
        sendInvitesStub.restore();
        delete require.cache[require.resolve('test/data/executors-invites')];
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('ExecutorsInvite');

        it('test correct content loaded on the page when more than 1 other executor', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, ['heading3']);
                });
        });

        it('test correct content loaded on the page when only 1 other executor', (done) => {
            sessionData.executors.executorsNumber = 2;
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, ['heading3-multiple']);
                });
        });

        it('test content displays only the applying executors but not the main applicant', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.agent.get(testWrapper.pageUrl)
                        .then(response => {
                            assert(response.text.includes('Andrew Wiles'));
                            assert(!response.text.includes('Pierre de Fermat'));
                            assert(!response.text.includes('Leonhard Euler'));
                            done();
                        });
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForExecInvites}`, (done) => {
            sendInvitesStub.returns(when(Promise.resolve({response: 'Make it pass!'})));
            const data = {list: [{firstName: 'Bob', lastName: 'Smith', isApplicant: true}]};

            testWrapper.testRedirect(done, data, expectedNextUrlForExecInvites);
        });

        it('test an error page is rendered if there is an error calling invite service', (done) => {
            sendInvitesStub.returns(when(Promise.resolve(new Error('ReferenceError'))));
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.agent.post(testWrapper.pageUrl)
                        .then(response => {
                            assert(response.status === 500);
                            assert(response.text.includes('Sorry, we&rsquo;re having technical problems'));
                            assert(sendInvitesStub.calledOnce, 'Send Invite function called');
                            done();
                        })
                        .catch(err => {
                            done(err);
                        });
                });
        });
    });
});
