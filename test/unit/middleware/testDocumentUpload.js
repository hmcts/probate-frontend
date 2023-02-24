// eslint-disable-line max-lines

'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const rewire = require('rewire');
const documentUploadMiddleware = rewire('app/middleware/documentUpload');
const DocumentUpload = require('app/utils/DocumentUpload');
const FormData = require('app/services/FormData');

describe('DocumentUploadMiddleware', () => {
    describe('getDocument()', () => {
        it('should return a function', (done) => {
            const result = documentUploadMiddleware.getDocument();
            expect(typeof result).to.equal('function');
            done();
        });
    });

    describe('initTimeout()', () => {
        it('should return a function', (done) => {
            const result = documentUploadMiddleware.initTimeout();
            expect(typeof result).to.equal('function');
            done();
        });
    });

    describe('errorOnTimeout()', () => {
        it('should carry on if the upload has not timed out', (done) => {
            const req = {
                timedout: false
            };
            const res = {};
            const next = sinon.spy();
            documentUploadMiddleware.errorOnTimeout(req, res, next);
            expect(next.calledOnce).to.equal(true);
            done();
        });

        it('should return an error if the upload has timed out', (done) => {
            const req = {
                session: {
                    language: 'en'
                },
                timedout: true,
                log: {
                    error: sinon.spy()
                }
            };
            const res = {};
            const next = {};
            const revert = documentUploadMiddleware.__set__('returnError', sinon.spy());
            const error = {
                js: 'The file may be too big, reduce the file size and try again or post the death certificate',
                nonJs: 'uploadTimeout'
            };
            documentUploadMiddleware.errorOnTimeout(req, res, next);
            expect(req.log.error.calledWith('Document upload timed out')).to.equal(true);
            expect(documentUploadMiddleware.__get__('returnError').calledWith(req, res, next, error)).to.equal(true);
            revert();
            done();
        });
    });

    describe('returnError()', () => {
        let req;
        let res;
        let next;
        let error;

        beforeEach(() => {
            req = {
                get: (key) => {
                    return req[key];
                },
                session: {
                    form: {
                        documents: {}
                    }
                }
            };
            res = {};
            next = {};
            error = {};
        });

        it('should return an error correctly for js users', (done) => {
            req['x-csrf-token'] = 'W6g3wqQf-z-bP5Kkg3fw19MVUOG-1dgFrHp8';
            res = Object.assign(res, {
                status: sinon.spy(),
                send: sinon.spy()
            });
            error.js = 'An error has occurred';
            documentUploadMiddleware.returnError(req, res, next, error);
            expect(res.status.calledWith(400)).to.equal(true);
            expect(res.send.calledWith(error.js)).to.equal(true);
            done();
        });

        it('should return an error correctly for non js users', (done) => {
            next = sinon.spy();
            error.nonJs = 'invalidFileType';
            documentUploadMiddleware.returnError(req, res, next, error);
            expect(req.session.form.documents.error).to.equal('invalidFileType');
            expect(next.calledOnce).to.equal(true);
            done();
        });
    });

    describe('uploadDocument()', () => {
        let req;
        let res;
        let next;
        let documentValidateStub;

        beforeEach(() => {
            req = {
                get: (key) => {
                    return req[key];
                },
                session: {
                    language: 'en',
                    form: {
                        documents: {}
                    }
                },
                log: {},
                body: {
                    isUploadingDocument: 'true'
                }
            };
            res = {};
            next = sinon.spy();
            documentValidateStub = sinon.stub(DocumentUpload.prototype, 'validate');
        });

        afterEach(() => {
            documentValidateStub.restore();
        });

        it('should continue if a document is not being uploaded because the user has clicked the continue button', (done) => {
            req.body.isUploadingDocument = null;
            documentUploadMiddleware.uploadDocument(req, res, next);
            expect(next.calledOnce).to.equal(true);
            done();
        });

        it('should add the returned url to documents.uploads if the document upload is successful', (done) => {
            const revert = documentUploadMiddleware.__set__('Document', class {
                post() {
                    return Promise.resolve({
                        body: [
                            'http://localhost:8383/documents/60e34ae2-8816-48a6-8b74-a1a3639cd505'
                        ]
                    });
                }
            });

            documentValidateStub.returns(null);
            const addDocumentStub = sinon.stub(DocumentUpload.prototype, 'addDocument').returns([{
                filename: 'death-certificate.pdf',
                url: 'http://localhost:8383/documents/60e34ae2-8816-48a6-8b74-a1a3639cd505'
            }]);
            req = Object.assign(req, {
                log: {
                    info: sinon.spy()
                },
                file: {
                    mimetype: 'image/jpeg'
                }
            });
            documentUploadMiddleware.uploadDocument(req, res, next);
            setTimeout(() => {
                expect(req.log.info.calledWith('Uploaded document passed frontend validation')).to.equal(true);
                expect(req.session.form.documents.uploads).to.deep.equal([{
                    filename: 'death-certificate.pdf',
                    url: 'http://localhost:8383/documents/60e34ae2-8816-48a6-8b74-a1a3639cd505'
                }]);
                expect(next.calledOnce).to.equal(true);
                addDocumentStub.restore();
                revert();
                done();
            });
        });

        describe('should return an error', () => {
            it('should return an error if the document fails frontend validation', (done) => {
                req.log.error = sinon.spy();
                const revert = documentUploadMiddleware.__set__('returnError', sinon.spy());
                const error = {
                    js: 'Save your file as a jpg, bmp, tiff, png or PDF file and try again',
                    nonJs: 'invalidFileType'
                };
                documentValidateStub.returns(error);
                documentUploadMiddleware.uploadDocument(req, res, next);
                expect(req.log.error.calledWith('Uploaded document failed frontend validation')).to.equal(true);
                expect(documentUploadMiddleware.__get__('returnError').calledOnce).to.equal(true);
                expect(documentUploadMiddleware.__get__('returnError').calledWith(req, res, next, error)).to.equal(true);
                revert();
                done();
            });

            it('if the document fails backend validation', (done) => {
                documentValidateStub.returns(null);
                const addDocumentStub = sinon.stub(DocumentUpload.prototype, 'addDocument').returns([{
                    filename: 'death-certificate.pdf',
                    url: 'http://localhost:8383/documents/60e34ae2-8816-48a6-8b74-a1a3639cd505'
                }]);
                const revert = documentUploadMiddleware.__set__({
                    returnError: sinon.spy(),
                    Document: class {
                        post() {
                            return Promise.resolve({
                                body: [
                                    'Error: invalid file type'
                                ]
                            });
                        }
                    }
                });
                req = Object.assign(req, {
                    log: {
                        info: sinon.spy(),
                        error: sinon.spy()
                    },
                    file: {
                        mimetype: 'image/jpeg'
                    }
                });
                const error = {
                    js: 'Save your file as a jpg, bmp, tiff, png or PDF file and try again',
                    nonJs: 'invalidFileType'
                };
                documentUploadMiddleware.uploadDocument(req, res, next);
                setTimeout(() => {
                    expect(req.log.info.calledWith('Uploaded document passed frontend validation')).to.equal(true);
                    expect(req.log.error.calledWith('Uploaded document failed backend validation')).to.equal(true);
                    expect(documentUploadMiddleware.__get__('returnError').calledWith(req, res, next, error)).to.equal(true);
                    revert();
                    addDocumentStub.restore();
                    done();
                });
            });

            it('if the document upload fails', (done) => {
                documentValidateStub.returns(null);
                const revert = documentUploadMiddleware.__set__({
                    returnError: sinon.spy(),
                    Document: class {
                        post() {
                            return Promise.reject(new Error('Upload failed'));
                        }
                    }
                });
                req = Object.assign(req, {
                    log: {
                        info: sinon.spy(),
                        error: sinon.spy()
                    },
                    file: {
                        mimetype: 'image/jpeg'
                    }
                });
                const error = {
                    js: 'Select your document and try again',
                    nonJs: 'uploadFailed'
                };
                documentUploadMiddleware.uploadDocument(req, res, next);
                setTimeout(() => {
                    expect(req.log.info.calledWith('Uploaded document passed frontend validation')).to.equal(true);
                    expect(req.log.error.calledWith('Document upload failed: Error: Upload failed')).to.equal(true);
                    expect(documentUploadMiddleware.__get__('returnError').calledWith(req, res, next, error)).to.equal(true);
                    revert();
                    done();
                });
            });
        });
    });

    describe('removeDocument()', () => {
        let req;

        beforeEach(() => {
            req = {
                session: {
                    form: {
                        ccdCase: {
                            id: 1234567890123456
                        },
                        documents: {
                            uploads: [
                                'http://localhost:8383/documents/60e34ae2-8816-48a6-8b74-a1a3639cd505'
                            ]
                        }
                    }
                },
                params: {
                    index: 0
                }
            };
        });

        it('should remove a document', (done) => {
            const formDataStub = sinon.stub(FormData.prototype, 'post');
            const revert = documentUploadMiddleware.__set__('Document', class {
                delete() {
                    return Promise.resolve(true);
                }
            });

            const revertFormData = documentUploadMiddleware.__set__('persistFormData', {
                persist() {
                    return {};
                }
            });

            const res = {
                redirect: sinon.spy()
            };
            const next = {};
            documentUploadMiddleware.removeDocument(req, res, next);
            revert();
            revertFormData();
            setTimeout(() => {
                expect(req.session.form.documents.uploads).to.deep.equal([]);
                expect(res.redirect.calledWith('/document-upload')).to.equal(true);
                done();
                formDataStub.restore();
            });
        });

        it('should return an error if a document cannot be removed', (done) => {
            const error = new Error('something');
            const revert = documentUploadMiddleware.__set__('Document', class {
                delete() {
                    return Promise.reject(error);
                }
            });
            const res = {};
            const next = sinon.spy();
            documentUploadMiddleware.removeDocument(req, res, next);
            setTimeout(() => {
                expect(next.calledWith(error)).to.equal(true);
                revert();
                done();
            });
        });

        it('should return an error if formdata cannot be persisted', (done) => {
            const error = new Error('something');
            const revertDelete = documentUploadMiddleware.__set__('Document', class {
                delete() {
                    return Promise.resolve(true);
                }
            });

            const revertPersist = documentUploadMiddleware.__set__({
                persistFormData: sinon.stub().throws(error)
            });

            const res = {redirect: sinon.stub()};
            const next = sinon.spy();
            documentUploadMiddleware.removeDocument(req, res, next);
            setTimeout(() => {
                expect(next.calledWith(error)).to.equal(true);
                revertDelete();
                revertPersist();
                done();
            });
        });
    });
});
