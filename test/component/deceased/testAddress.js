'use strict';

const TestWrapper = require('test/util/TestWrapper');
const Summary = require('app/steps/ui/summary/index');
const IhtMethod = require('app/steps/ui/iht/method/index');
const DocumentUpload = require('app/steps/ui/documentupload/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');
const config = require('app/config');
const nock = require('nock');
const featureToggleUrl = config.featureToggles.url;
const documentUploadFeatureTogglePath = `${config.featureToggles.path}/${config.featureToggles.document_upload}`;

describe('deceased-address', () => {
    let testWrapper;
    const expectedNextUrlForSummary = Summary.getUrl();
    const expectedNextUrlForIhtMethod = IhtMethod.getUrl();
    const expectedNextUrlForDocumentUpload = DocumentUpload.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedAddress');
    });

    afterEach(() => {
        testWrapper.destroy();
        nock.cleanAll();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('DeceasedAddress');

        it('test right content loaded on the page', (done) => {
            const excludeKeys = ['selectAddress'];

            testWrapper.testContent(done, excludeKeys);
        });

        it('test address schema validation when no address search has been done', (done) => {
            const data = {addressFound: 'none'};

            testWrapper.testErrors(done, data, 'required', ['postcodeLookup']);
        });

        it('test address schema validation when address search is successful, but no address is selected/entered', (done) => {
            const data = {addressFound: 'true'};

            testWrapper.testErrors(done, data, 'oneOf', ['crossField']);

        });

        it('test address schema validation when address search is successful, and two addresses are provided', (done) => {
            const data = {
                addressFound: 'true',
                freeTextAddress: 'free text address',
                postcodeAddress: 'postcode address'
            };

            testWrapper.testErrors(done, data, 'oneOf', ['crossField']);
        });

        it('test address schema validation when address search is unsuccessful', (done) => {
            const data = {
                addressFound: 'false'
            };

            testWrapper.testErrors(done, data, 'required', ['freeTextAddress']);
        });

        it(`test it redirects to iht method page: ${expectedNextUrlForIhtMethod}`, (done) => {
            nock(featureToggleUrl)
                .get(documentUploadFeatureTogglePath)
                .reply(200, 'false');

            const data = {
                postcode: 'ea1 eaf',
                postcodeAddress: '102 Petty France'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForIhtMethod);
        });

        it(`test it redirects to document upload page: ${expectedNextUrlForDocumentUpload}`, (done) => {
            nock(featureToggleUrl)
                .get(documentUploadFeatureTogglePath)
                .reply(200, 'true');

            const data = {
                postcode: 'ea1 eaf',
                postcodeAddress: '102 Petty France'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForDocumentUpload);
        });

        it(`test it redirects to summary page: ${expectedNextUrlForSummary}`, (done) => {
            nock(featureToggleUrl)
                .get(documentUploadFeatureTogglePath)
                .reply(200, 'false');

            const data = {
                postcode: 'ea1 eaf',
                postcodeAddress: '102 Petty France'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForIhtMethod);
        });
    });
});
