'use strict';

const TestWrapper = require('test/util/TestWrapper');
const {assert} = require('chai');
const caseTypes = require('app/utils/CaseTypes');

describe('executors-update-invite', () => {
    let testWrapper;
    let sessionData;

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorsUpdateInvite');
        sessionData = require('test/data/executors-invites');
        sessionData.type = caseTypes.GOP;
        sessionData.ccdCase = {
            state: 'Pending',
            id: 1234567890123456
        };
    });

    afterEach(() => {
        testWrapper.destroy();
        delete require.cache[require.resolve('test/data/executors-invites')];
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test correct content loaded on the page when only 1 other executor has had their email changed', (done) => {
            sessionData.executors.list[1].emailChanged = true;
            sessionData.executors.list[2].isApplying = true;
            sessionData.executors.list[2].emailChanged = false;
            const contentToExclude = ['header-multiple'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, {}, contentToExclude);
                });
        });

        it('test correct content loaded on the page when more than 1 other executor has had their email changed', (done) => {
            sessionData.executors.list[1].emailChanged = true;
            sessionData.executors.list[2].isApplying = true;
            sessionData.executors.list[2].emailChanged = true;
            const contentToExclude = ['header'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, {}, contentToExclude);
                });
        });

        it('test content displays only the executors who have had their emails changed', (done) => {
            sessionData.executors.list[1].emailChanged = true;
            sessionData.executors.list[2].isApplying = true;
            sessionData.executors.list[2].emailChanged = true;

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.agent.get(testWrapper.pageUrl)
                        .then(response => {
                            assert(response.text.includes('Andrew Wiles'));
                            assert(response.text.includes('Leonhard Euler'));
                            assert(!response.text.includes('Pierre de Fermat'));
                            done();
                        });
                });
        });

        it('test content displays only the single executor who has had their email changed', (done) => {
            sessionData.executors.list[1].emailChanged = true;
            sessionData.executors.list[2].isApplying = true;
            sessionData.executors.list[2].emailChanged = false;

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.agent.get(testWrapper.pageUrl)
                        .then(response => {
                            assert(response.text.includes('Andrew Wiles'));
                            assert(!response.text.includes('Leonhard Euler'));
                            assert(!response.text.includes('Pierre de Fermat'));
                            done();
                        });
                });
        });

        it('test an error page is rendered if there is an error calling invite service', (done) => {
            sessionData.executors.list[1].emailChanged = true;

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
    });
});
