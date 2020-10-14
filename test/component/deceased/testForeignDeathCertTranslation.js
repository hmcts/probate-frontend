'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DocumentUpload = require('app/steps/ui/documentupload');
const testCommonContent = require('test/component/common/testCommonContent.js');

describe('foreign-death-cert-translation', () => {
    let testWrapper;
    const ftValue = {ft_new_deathcert_flow: true};
    const expectedNextUrlForDocumentUpload = DocumentUpload.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ForeignDeathCertTranslation');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ForeignDeathCertTranslation');

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

        it('test foreignDeathCertTranslation schema validation when no data is entered', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to document uploads page: ${expectedNextUrlForDocumentUpload}`, (done) => {
            const data = {
                foreignDeathCertTranslation: 'optionYes'
            };

            testWrapper.agent.post('/prepare-session/featureToggles')
                .send(ftValue)
                .end(() => {
                    testWrapper.testRedirect(done, data, expectedNextUrlForDocumentUpload);
                });
        });
    });
});
