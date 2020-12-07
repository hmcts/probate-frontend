'use strict';

const TestWrapper = require('test/util/TestWrapper');
const IhtMethod = require('app/steps/ui/iht/method');
const commonContent = require('app/resources/en/translation/common');
const content = require('app/resources/en/translation/documentupload');
const config = require('config');
const nock = require('nock');
const expect = require('chai').expect;

describe('document-upload', () => {
    let testWrapper;
    const expectedNextUrlForIhtMethod = IhtMethod.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DocumentUpload');
    });

    afterEach(async () => {
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test help block content loaded on the page', (done) => {
            const sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const playbackData = {
                        helpTitle: commonContent.helpTitle,
                        helpHeading1: commonContent.helpHeading1,
                        helpHeading2: commonContent.helpHeading2,
                        helpHeading3: commonContent.helpHeading3,
                        helpTelephoneNumber: commonContent.helpTelephoneNumber,
                        helpTelephoneOpeningHours: commonContent.helpTelephoneOpeningHours,
                        helpEmailLabel: commonContent.helpEmailLabel.replace(/{contactEmailAddress}/g, commonContent.helpEmail)
                    };

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test content loaded on the page', (done) => {
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

        it('test it remains on the document upload page after uploading a document', (done) => {
            nock(config.services.orchestrator.url)
                .post(config.documentUpload.paths.upload)
                .reply(200, [
                    'http://localhost:8383/documents/60e34ae2-8816-48a6-8b74-a1a3639cd505'
                ]);

            testWrapper.agent.post('/prepare-session-field/serviceAuthorization/SERVICE_AUTH_123')
                .end(() => {
                    testWrapper.agent
                        .post(testWrapper.pageUrl)
                        .set('enctype', 'multipart/form-data')
                        .field('isUploadingDocument', 'true')
                        .attach('file', 'test/data/document-upload/valid-image.png')
                        .expect('location', testWrapper.pageUrl)
                        .expect(302)
                        .then(() => {
                            nock.cleanAll();
                            done();
                        })
                        .catch(done);
                });
        });

        it('test it displays an error message when uploading a document with an incorrect type', (done) => {
            testWrapper.agent
                .post(testWrapper.pageUrl)
                .set('enctype', 'multipart/form-data')
                .field('isUploadingDocument', 'true')
                .attach('file', 'test/data/document-upload/invalid-type.txt')
                .then((res) => {
                    expect(res.text).to.contain(content.errors.file.invalidFileType);
                    done();
                })
                .catch(done);
        });

        it('test it displays an error message when uploading a document which is too large', (done) => {
            testWrapper.agent
                .post(testWrapper.pageUrl)
                .set('enctype', 'multipart/form-data')
                .field('isUploadingDocument', 'true')
                .field('maxFileSize', config.documentUpload.maxSizeBytesTest)
                .attach('file', 'test/data/document-upload/image-too-large.jpg')
                .then((res) => {
                    expect(res.text).to.contain(content.errors.file.maxSize);
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
                    expect(res.text).to.contain(content.errors.file.uploadFailed);
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
                    expect(res.text).to.contain(content.errors.file.nothingUploaded);
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
                    expect(res.text).to.contain(content.errors.file.invalidFileType);
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
                    expect(res.text).to.contain(content.errors.file.invalidFileType);
                    done();
                })
                .catch(done);
        });

        it('test it redirects to the iht method page after clicking the continue button', (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForIhtMethod);
        });
    });
});
