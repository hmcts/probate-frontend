'use strict';

const TestWrapper = require('test/util/TestWrapper');
const CoApplicantAgreePage = require('app/steps/ui/coapplicant/agreepage');
const CoApplicantDisagreePage = require('app/steps/ui/coapplicant/disagreepage');
const commonContent = require('app/resources/en/translation/common');
const nock = require('nock');
const config = require('config');
const orchestratorServiceUrl = config.services.orchestrator.url;
const idamS2sUrl = config.services.idam.s2s_url;
const idamApiUrl = config.services.idam.apiUrl;
const invitesAllAgreedNock = () => {
    nock(orchestratorServiceUrl)
        .get('/invite/allAgreed/undefined')
        .reply(200, 'false');
    nock(orchestratorServiceUrl)
        .get('/invite/allAgreed/1234567890123456')
        .reply(200, 'false');
};
const inviteAgreedNock = () => {
    nock(idamS2sUrl)
        .post('/lease')
        .times(2)
        .reply(200, '123');
    nock(idamApiUrl)
        .post(config.services.idam.probate_oauth_authorise_path)
        .times(2)
        .reply(200, {code: '456'});
    nock(idamApiUrl)
        .post('/oauth2/token')
        .times(2)
        .reply(200, {access_token: '789'});
    nock(orchestratorServiceUrl)
        .post('/invite/agreed/1234567890123456')
        .times(5)
        .reply(200, 'dummy_invite_id');
};

describe('co-applicant-declaration', () => {
    let testWrapper;
    let sessionData;
    const expectedNextUrlForCoAppAgree = CoApplicantAgreePage.getUrl();
    const expectedNextUrlForCoAppDisagree = CoApplicantDisagreePage.getUrl();

    beforeEach(() => {
        invitesAllAgreedNock();
        sessionData = require('test/data/complete-form-undeclared').formdata;
        testWrapper = new TestWrapper('CoApplicantDeclaration');
    });

    afterEach(async () => {
        delete require.cache[require.resolve('test/data/complete-form-undeclared')];
        nock.cleanAll();
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test right content loaded on the page', (done) => {
            const contentToExclude = [
                'executorNotApplyingHeader'
            ];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        mainApplicantName: 'Bob Smith'
                    };

                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testErrors(done, {}, 'required');
                });
        });

        it(`test it redirects to agree page: ${expectedNextUrlForCoAppAgree}`, (done) => {
            inviteAgreedNock();

            testWrapper.agent.post('/prepare-session/form')
                .send({
                    ccdCase: {
                        id: 1234567890123456,
                        state: 'Pending'
                    }
                })
                .end(() => {
                    testWrapper.agent.post('/prepare-session-field/inviteId/98562349756342563456349695634593')
                        .end(() => {
                            const data = {
                                agreement: 'optionYes'
                            };
                            testWrapper.testRedirect(done, data, expectedNextUrlForCoAppAgree);
                        });
                });
        });

        it(`test it redirects to disagree page: ${expectedNextUrlForCoAppDisagree}`, (done) => {
            inviteAgreedNock();

            testWrapper.agent.post('/prepare-session/form')
                .send({
                    ccdCase: {
                        id: 1234567890123456,
                        state: 'Pending'
                    }
                })
                .end(() => {
                    const data = {
                        agreement: 'optionNo'
                    };
                    testWrapper.testRedirect(done, data, expectedNextUrlForCoAppDisagree);
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
