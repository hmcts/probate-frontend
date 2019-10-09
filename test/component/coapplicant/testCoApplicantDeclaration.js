'use strict';

const TestWrapper = require('test/util/TestWrapper');
const content = require('app/resources/en/translation/coapplicant/declaration.json');
const CoApplicantAgreePage = require('app/steps/ui/coapplicant/agreepage');
const CoApplicantDisagreePage = require('app/steps/ui/coapplicant/disagreepage');
const commonContent = require('app/resources/en/translation/common');
const nock = require('nock');
const config = require('app/config');
const orchestratorServiceUrl = config.services.orchestrator.url;
const invitesAllAgreedNock = () => {
    nock(orchestratorServiceUrl)
        .get('/invite/allAgreed/undefined')
        .reply(200, 'false');
    nock(orchestratorServiceUrl)
        .get('/invite/allAgreed/1234567890123456')
        .reply(200, 'false');
};
const inviteAgreedNock = () => {
    nock(orchestratorServiceUrl)
        .post('/invite/agreed/1234567890123456')
        .reply(200, 'false');
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

    afterEach(() => {
        delete require.cache[require.resolve('test/data/complete-form-undeclared')];
        nock.cleanAll();
        testWrapper.destroy();
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
                        state: 'Draft'
                    }
                })
                .end(() => {
                    const data = {
                        agreement: content.optionYes
                    };
                    testWrapper.testRedirect(done, data, expectedNextUrlForCoAppAgree);
                });
        });

        it(`test it redirects to disagree page: ${expectedNextUrlForCoAppDisagree}`, (done) => {
            inviteAgreedNock();

            testWrapper.agent.post('/prepare-session/form')
                .send({
                    ccdCase: {
                        id: 1234567890123456,
                        state: 'Draft'
                    }
                })
                .end(() => {
                    const data = {
                        agreement: content.optionNo
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
