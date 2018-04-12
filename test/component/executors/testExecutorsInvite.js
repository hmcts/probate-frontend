const TestWrapper = require('test/util/TestWrapper'),
    services = require('app/components/services'),
    sinon = require('sinon'),
    when = require('when'),
    {assert} = require('chai'),
    ExecutorsInvitesSent = require('app/steps/ui/executors/invitesent/index');

describe('executors-invite', () => {
    let testWrapper;
    let sendInvitesStub;
    const sessionData = require('test/data/executors-invites');
    const expectedNextUrlForExecInvites = ExecutorsInvitesSent.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorsInvite')
        sendInvitesStub = sinon.stub(services, 'sendInvite')

    });

    afterEach(() => {
        testWrapper.destroy()
        sendInvitesStub.restore()
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test content loaded on the page', (done) => {
            testWrapper.testContent(done)
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
                            done()
                        });
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForExecInvites}`, (done) => {
            sendInvitesStub.returns(when(Promise.resolve({response: 'Make it pass!'})));
            const data = {'list': [{'firstName': 'Bob', 'lastName': 'Smith', 'isApplicant': true}]};

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
                            done()
                        })
                        .catch(err => {
                            done(err)
                        })
                });
        });
    });
});