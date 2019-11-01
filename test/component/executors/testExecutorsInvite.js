'use strict';

const TestWrapper = require('test/util/TestWrapper');
const {assert} = require('chai');
const ExecutorsInvitesSent = require('app/steps/ui/executors/invitesent');
const testCommonContent = require('test/component/common/testCommonContent.js');
const nock = require('nock');
const config = require('app/config');
const orchestratorServiceUrl = config.services.orchestrator.url;
const afterEachNocks = (done) => {
    return () => {
        nock.cleanAll();
        done();
    };
};

describe('executors-invite', () => {
    let testWrapper;
    let sessionData;
    const expectedNextUrlForExecInvites = ExecutorsInvitesSent.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorsInvite');
        sessionData = require('test/data/executors-invites');
        sessionData.ccdCase = {
            state: 'Pending',
            id: 1234567890123456
        };
    });

    afterEach(() => {
        delete require.cache[require.resolve('test/data/executors-invites')];
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ExecutorsInvite');

        it('test correct content loaded on the page when more than 1 other executor', (done) => {
            const contentToExclude = ['heading3'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, {}, contentToExclude);
                });
        });

        it('test correct content loaded on the page when only 1 other executor', (done) => {
            const contentToExclude = ['heading3-multiple'];
            sessionData.executors.executorsNumber = 2;
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, {}, contentToExclude);
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
            nock(orchestratorServiceUrl)
                .post('/invite')
                .reply(200, {
                    invitations: [
                        {
                            inviteId: '1234'
                        }
                    ]
                });

            const data = {
                list: [
                    {
                        firstName: 'Bob',
                        lastName: 'Smith',
                        isApplicant: true
                    }
                ]
            };

            testWrapper.testRedirect(afterEachNocks(done), data, expectedNextUrlForExecInvites);
        });

        it('test an error page is rendered if there is an error calling invite service', (done) => {
            nock(orchestratorServiceUrl)
                .post('/invite')
                .reply(500, new Error('ReferenceError'));

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.agent.post(testWrapper.pageUrl)
                        .then(response => {
                            assert(response.status === 500);
                            assert(response.text.includes('Sorry, we&rsquo;re having technical problems'));
                            nock.cleanAll();
                            done();
                        })
                        .catch(err => {
                            nock.cleanAll();
                            done(err);
                        });
                });
        });
    });
});
