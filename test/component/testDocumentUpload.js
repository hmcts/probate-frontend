'use strict';

const TestWrapper = require('test/util/TestWrapper');
const IhtMethod = require('app/steps/ui/iht/method/index');
const common = require('app/resources/en/translation/common');
const config = require('app/config');
const nock = require('nock');
const {expect} = require('chai');
const sinon = require('sinon');
const services = require('app/components/services');

const featureToggleUrl = `${config.featureToggles.url}:${config.featureToggles.port}`;
const featureTogglePath = `${config.featureToggles.path}/${config.featureToggles.document_upload}`;

describe('document-upload', () => {
    let testWrapper;
    const expectedNextUrlForIhtMethod = IhtMethod.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DocumentUpload');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test content loaded on the page', (done) => {
            nock(featureToggleUrl)
                .get(featureTogglePath)
                .reply(200, 'true');

            testWrapper.testContent(done);
        });

        it('test help block content loaded on the page', (done) => {
            nock(featureToggleUrl)
                .get(featureTogglePath)
                .reply(200, 'true');

            const playbackData = {};
            playbackData.helpTitle = common.helpTitle;
            playbackData.helpText = common.helpText;
            playbackData.contactTelLabel = common.contactTelLabel.replace('{helpLineNumber}', config.helpline.number);
            playbackData.contactOpeningTimes = common.contactOpeningTimes.replace('{openingTimes}', config.helpline.hours);
            playbackData.helpEmailLabel = common.helpEmailLabel;
            playbackData.contactEmailAddress = common.contactEmailAddress;

            testWrapper.testDataPlayback(done, playbackData);
        });

        it('test it remains on the document upload page after uploading a document', (done) => {
            const uploadDocumentStub = sinon.stub(services, 'uploadDocument').returns(Promise.resolve({
                body: [
                    'http://localhost:8383/documents/60e34ae2-8816-48a6-8b74-a1a3639cd505'
                ]
            }));

            testWrapper.agent
                .post(testWrapper.pageUrl)
                .set('enctype', 'multipart/form-data')
                .field('isUploadingDocument', 'true')
                .attach('file', 'test/data/document-upload/valid-image.png')
                .expect('location', testWrapper.pageUrl)
                .expect(302)
                .then(() => {
                    uploadDocumentStub.restore();
                    done();
                })
                .catch(done);
        });

        it('test it displays an error message when uploading a document with an incorrect type', (done) => {
            testWrapper.agent
                .post(testWrapper.pageUrl)
                .set('enctype', 'multipart/form-data')
                .field('isUploadingDocument', 'true')
                .attach('file', 'test/data/document-upload/invalid-type.txt')
                .then((res) => {
                    expect(res.text).to.contain('<li><a href="#file">You have used a file type that can&rsquo;t be accepted. Save your file as a jpg, bmp, tiff, png or PDF file and try again</a></li>');
                    done();
                })
                .catch(done);
        });

        it('test it displays an error message when uploading a document which is too large', (done) => {
            testWrapper.agent
                .post(testWrapper.pageUrl)
                .set('enctype', 'multipart/form-data')
                .field('isUploadingDocument', 'true')
                .attach('file', 'test/data/document-upload/image-too-large.jpg')
                .then((res) => {
                    expect(res.text).to.contain('<li><a href="#file">Your file is too large to upload. Use a file that is under 10MB and try again</a></li>');
                    done();
                })
                .catch(done);
        });

        it('test it displays an error when a document failed to upload', (done) => {
            testWrapper.agent
                .post(testWrapper.pageUrl)
                .set('enctype', 'multipart/form-data')
                .field('isUploadingDocument', 'true')
                .attach('file', 'test/data/document-upload/valid-image.png')
                .then((res) => {
                    expect(res.text).to.contain('<li><a href="#file">Your document failed to upload. Select your document and try again</a></li>');
                    done();
                })
                .catch(done);
        });

        it('test it displays an error message when trying to upload without a document', (done) => {
            testWrapper.agent
                .post(testWrapper.pageUrl)
                .set('enctype', 'multipart/form-data')
                .field('isUploadingDocument', 'true')
                .then((res) => {
                    expect(res.text).to.contain('<li><a href="#file">You need to select a file before you can upload it. Click &lsquo;browse&rsquo; to find a file to upload</a></li>');
                    done();
                })
                .catch(done);
        });

        it('test it displays an error message when uploading a document with an incorrect type and a valid extension', (done) => {
            testWrapper.agent
                .post(testWrapper.pageUrl)
                .set('enctype', 'multipart/form-data')
                .field('isUploadingDocument', 'true')
                .attach('file', 'test/data/document-upload/invalid-type.jpg')
                .then((res) => {
                    expect(res.text).to.contain('<li><a href="#file">You have used a file type that can&rsquo;t be accepted. Save your file as a jpg, bmp, tiff, png or PDF file and try again</a></li>');
                    done();
                })
                .catch(done);
        });

        it('test it displays an error message when uploading a valid document with an invalid extension', (done) => {
            testWrapper.agent
                .post(testWrapper.pageUrl)
                .set('enctype', 'multipart/form-data')
                .field('isUploadingDocument', 'true')
                .attach('file', 'test/data/document-upload/invalid-type.jpg')
                .then((res) => {
                    expect(res.text).to.contain('<li><a href="#file">You have used a file type that can&rsquo;t be accepted. Save your file as a jpg, bmp, tiff, png or PDF file and try again</a></li>');
                    done();
                })
                .catch(done);
        });

        it('test it redirects to the iht method page after clicking the continue button', (done) => {
            const data = {};
            testWrapper.testRedirect(done, data, expectedNextUrlForIhtMethod);
        });

    });
});
