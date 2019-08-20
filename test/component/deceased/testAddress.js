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
            const excludeKeys = ['selectAddress'];

            testWrapper.testContent(done, excludeKeys);
        });

        it('test address schema validation when address search is unsuccessful', (done) => {
            const data = {
                addressFound: 'false'
            };

            testWrapper.testErrors(done, data, 'required', ['addressLine1']);
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
