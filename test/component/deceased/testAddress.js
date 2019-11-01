'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DocumentUpload = require('app/steps/ui/documentupload');
const testCommonContent = require('test/component/common/testCommonContent.js');

describe('deceased-address', () => {
    let testWrapper;
    const expectedNextUrlForDocumentUpload = DocumentUpload.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedAddress');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('DeceasedAddress');

        it('test right content loaded on the page', (done) => {
            const sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                }
            };
            const contentToExclude = ['selectAddress'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, {}, contentToExclude);
                });
        });

        it('test address schema validation when address search is unsuccessful', (done) => {
            const data = {
                addressFound: 'false'
            };
            const errorsToTest = ['addressLine1'];

            testWrapper.testErrors(done, data, 'required', errorsToTest);
        });

        it(`test it redirects to document upload page: ${expectedNextUrlForDocumentUpload}`, (done) => {
            const data = {
                addressLine1: 'value',
                postTown: 'value',
                newPostCode: 'value'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForDocumentUpload);
        });
    });
});
