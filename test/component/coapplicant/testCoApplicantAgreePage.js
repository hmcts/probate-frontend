'use strict';

const TestWrapper = require('test/util/TestWrapper');
const sessionData = require('test/data/complete-form-undeclared');
const commonContent = require('app/resources/en/translation/common');
const nock = require('nock');
const config = require('app/config');
const businessServiceUrl = config.services.validation.url.replace('/validate', '');

describe('co-applicant-agree-page', () => {
    let testWrapper;
    let contentData;

    beforeEach(() => {
        testWrapper = new TestWrapper('CoApplicantAgreePage');
        contentData = {
            leadExecFullName: 'Bob Smith'
        };
    });

    afterEach(() => {
        nock.cleanAll();
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test correct content is loaded on the page when there are no codicils', (done) => {
            nock(businessServiceUrl)
                .get('/invites/allAgreed/undefined')
                .reply(200, false);

            const contentToExclude = [
                'paragraph4-codicils'
            ];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData.formdata)
                .end(() => {
                    testWrapper.testContent(done, contentToExclude, contentData);
                });
        });

        it('test correct content is loaded on the page when there are codicils', (done) => {
            nock(businessServiceUrl)
                .get('/invites/allAgreed/undefined')
                .reply(200, false);

            sessionData.formdata.will.codicils = commonContent.yes;

            const contentToExclude = [
                'paragraph4'
            ];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData.formdata)
                .end(() => {
                    testWrapper.testContent(done, contentToExclude, contentData);
                });
        });

        it('test save and close link is not displayed on the page', (done) => {
            const playbackData = {
                saveAndClose: commonContent.saveAndClose,
                signOut: commonContent.signOut
            };
            testWrapper.testContentNotPresent(done, playbackData);
        });
    });
});
