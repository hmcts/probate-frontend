'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DocumentUpload = require('app/steps/ui/documentupload');
const ForeignDeathCertTranslation = require('app/steps/ui/deceased/foreigndeathcerttranslation');
const testCommonContent = require('test/component/common/testCommonContent.js');

describe('english-foreign-death-cert', () => {
    let testWrapper;
    const ftValue = {ft_new_deathcert_flow: true};
    const expectedNextUrlForDocumentUpload = DocumentUpload.getUrl();
    const expectedNextUrlForForeignDeathCertTranslation = ForeignDeathCertTranslation.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('EnglishForeignDeathCert');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('EnglishForeignDeathCert');

        it('test correct content loaded on the page', (done) => {
            const sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done);
                });
        });

        it('test englishForeignDeathCert schema validation when no data is entered', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to document uploads page: ${expectedNextUrlForDocumentUpload}`, (done) => {
            const data = {
                englishForeignDeathCert: 'optionYes'
            };

            testWrapper.agent.post('/prepare-session/featureToggles')
                .send(ftValue)
                .end(() => {
                    testWrapper.testRedirect(done, data, expectedNextUrlForDocumentUpload);
                });
        });

        it(`test it redirects to foreign death cert translated  page: ${expectedNextUrlForForeignDeathCertTranslation}`, (done) => {
            const data = {
                englishForeignDeathCert: 'optionNo'
            };

            testWrapper.agent.post('/prepare-session/featureToggles')
                .send(ftValue)
                .end(() => {
                    testWrapper.testRedirect(done, data, expectedNextUrlForForeignDeathCertTranslation);
                });
        });
    });
});
