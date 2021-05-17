'use strict';

const TestWrapper = require('test/util/TestWrapper');
const commonContent = require('app/resources/en/translation/common');
const content = require('app/resources/en/translation/documentupload');
const config = require('config');
const expect = require('chai').expect;

describe('document-upload', () => {
    let testWrapper;

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
    });
});
