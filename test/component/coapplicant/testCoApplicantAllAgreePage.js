'use strict';

const TestWrapper = require('test/util/TestWrapper');
const commonContent = require('app/resources/en/translation/common');
const nock = require('nock');
const config = require('app/config');
const businessServiceUrl = config.services.validation.url.replace('/validate', '');
const afterEachNocks = (done) => {
    return () => {
        done();
        nock.cleanAll();
    };
};

describe('co-applicant-all-agreed-page', () => {
    let testWrapper;
    let sessionData;
    let contentData;

    beforeEach(() => {
        sessionData = require('test/data/complete-form-undeclared').formdata;
        testWrapper = new TestWrapper('CoApplicantAllAgreedPage');
    });

    afterEach(() => {
        delete require.cache[require.resolve('test/data/complete-form-undeclared')];
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test correct content is loaded on the page when there are no codicils', (done) => {
            nock(businessServiceUrl)
                .get('/invites/allAgreed/undefined')
                .reply(200, true);

            sessionData.will.codicils = commonContent.no;

            const contentToExclude = [
                'paragraph4-codicils'
            ];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent((afterEachNocks(done)), contentData, contentToExclude);
                });
        });

        it('test correct content is loaded on the page when there are codicils', (done) => {
            nock(businessServiceUrl)
                .get('/invites/allAgreed/undefined')
                .reply(200, true);

            sessionData.will.codicils = commonContent.yes;

            const contentToExclude = [
                'paragraph4'
            ];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent((afterEachNocks(done)), contentData, contentToExclude);
                });
        });

        it('test "save and close", "my account" and "sign out" links are not displayed on the page', (done) => {
            const playbackData = {
                saveAndClose: commonContent.saveAndClose,
                myApplications: commonContent.myApplications,
                signOut: commonContent.signOut
            };

            testWrapper.testContentNotPresent(done, playbackData);
        });
    });
});
