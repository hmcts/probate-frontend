'use strict';

const TestWrapper = require('test/util/TestWrapper.cjs');
const {assert} = require('chai');
const caseTypes = require('app/utils/CaseTypes.cjs');
const nock = require('nock');
const config = require('config');
const orchestratorServiceUrl = config.services.orchestrator.url;

describe('executors-additional-invite', () => {
    let testWrapper;
    let sessionData;

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorsAdditionalInvite');
        sessionData = require('test/data/executors-invites');
        sessionData.type = caseTypes.GOP;
        sessionData.ccdCase = {
            state: 'Pending',
            id: 1234567890123456
        };
    });

    afterEach(() => {
        delete require.cache[require.resolve('test/data/executors-invites')];
        nock.cleanAll();
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test correct content loaded on the page when only 1 other executor has been added and needs to be emailed', (done) => {
            sessionData.executors.list = [
                {fullName: 'Applicant', isApplying: true, isApplicant: true},
                {fullName: 'Andrew Wiles', isApplying: true, emailSent: false}
            ];
            const contentToExclude = ['header-multiple'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, {}, contentToExclude);
                });
        });

        it('test correct content loaded on the page when more than 1 other executor has been added and needs to be emailed', (done) => {
            sessionData.executors.list = [
                {fullName: 'Applicant', isApplying: true, isApplicant: true},
                {fullName: 'Andrew Wiles', isApplying: true, emailSent: false},
                {fullName: 'Leonhard Euler', isApplying: true, emailSent: false}
            ];
            const contentToExclude = ['header'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, {}, contentToExclude);
                });
        });

        it('test content displays only the executors who have been added and need to be emailed', (done) => {
            sessionData.executors.list = [
                {fullName: 'Applicant', isApplying: true, isApplicant: true},
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
            sessionData.executors.list = [
                {fullName: 'Applicant', isApplying: true, isApplicant: true},
                {fullName: 'Andrew Wiles', isApplying: true, emailSent: false},
                {fullName: 'Leonhard Euler', isApplying: true, emailSent: true}
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
