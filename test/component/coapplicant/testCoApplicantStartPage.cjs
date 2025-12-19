'use strict';

const TestWrapper = require('test/util/TestWrapper');
const commonContent = require('app/resources/en/translation/common');
const nock = require('nock');
const config = require('config');
const orchestratorServiceUrl = config.services.orchestrator.url;

describe('co-applicant-start-page', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('CoApplicantStartPage');
    });

    afterEach(async () => {
        nock.cleanAll();
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test correct content is loaded on the page', (done) => {
            nock(orchestratorServiceUrl)
                .get('/invite/allAgreed/undefined')
                .reply(200, 'false');

            const sessionData = {
                applicant: {
                    firstName: 'John',
                    lastName: 'TheApplicant'
                },
                deceased: {
                    firstName: 'Dave',
                    lastName: 'Bassett'
                },
                pin: '12345'
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        leadExecutorName: 'John TheApplicant',
                        deceasedName: 'Dave Bassett',
                        pin: ''
                    };
                    testWrapper.testContent(done, contentData);
                });
        });

        it('test "save and close", "my applications" and "sign out" links are not displayed on the page', (done) => {
            const playbackData = {
                saveAndClose: commonContent.saveAndClose,
                myApplications: commonContent.myApplications,
                signOut: commonContent.signOut
            };

            testWrapper.testContentNotPresent(done, playbackData);
        });
    });
});
