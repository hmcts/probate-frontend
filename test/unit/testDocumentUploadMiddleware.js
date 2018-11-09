// eslint-disable-line max-lines

'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const rewire = require('rewire');
const documentUploadMiddleware = rewire('app/middleware/documentUpload');
const DocumentUpload = require('app/utils/DocumentUpload');
const services = require('app/components/services');

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
                timedout: true,
                log: {
                    error: sinon.spy()
                }
            };
            const res = {};
            const next = {};
            const revert = documentUploadMiddleware.__set__('returnError', sinon.spy());
            const error = {
                js: 'Please either try again or reduce the size of the file',
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
        let uploadDocumentServiceStub;
        let documentValidateStub;

        beforeEach(() => {
            req = {
                get: (key) => {
                    return req[key];
                },
                session: {
                    form: {
                        documents: {}
                    }
                },
                error: null,
                log: {},
                body: {
                    isUploadingDocument: 'true'
                }
            };
            res = {};
            next = sinon.spy();
            uploadDocumentServiceStub = sinon.stub(services, 'uploadDocument');
            documentValidateStub = sinon.stub(DocumentUpload.prototype, 'validate');
        });

        afterEach(() => {
            uploadDocumentServiceStub.restore();
            documentValidateStub.restore();
        });

        it('should continue if a document is not being uploaded because the user has clicked the continue button', (done) => {
            req.body.isUploadingDocument = null;
            documentUploadMiddleware.uploadDocument(req, res, next);
            expect(next.calledOnce).to.equal(true);
            done();
        });

        it('should add the returned url to documents.uploads if the document upload is successful', (done) => {
            documentValidateStub.returns(null);
            uploadDocumentServiceStub.returns(Promise.resolve({
                body: [
                    'http://localhost:8383/documents/60e34ae2-8816-48a6-8b74-a1a3639cd505'
                ]
            }));
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
                done();
            });
        });

        describe('should return an error', () => {
            it('should return an error if the document fails frontend validation', (done) => {
                req = Object.assign(req, {
                    error: {
                        js: 'Save your file as a jpg, bmp, tiff, png or PDF file and try again',
                        nonJs: 'invalidFileType'
                    },
                    log: {
                        error: sinon.spy()
                    }
                });
                const revert = documentUploadMiddleware.__set__('returnError', sinon.spy());
                documentUploadMiddleware.uploadDocument(req, res, next);
                expect(req.log.error.calledWith('Uploaded document failed frontend validation')).to.equal(true);
                expect(documentUploadMiddleware.__get__('returnError').calledOnce).to.equal(true);
                expect(documentUploadMiddleware.__get__('returnError').calledWith(req, res, next, req.error)).to.equal(true);
                revert();
                done();
            });

            it('if the document fails backend validation', (done) => {
                documentValidateStub.returns(null);
                uploadDocumentServiceStub.returns(Promise.resolve({
                    body: [
                        'Error: invalid file type'
                    ]
                }));
                const addDocumentStub = sinon.stub(DocumentUpload.prototype, 'addDocument').returns([{
                    filename: 'death-certificate.pdf',
                    url: 'http://localhost:8383/documents/60e34ae2-8816-48a6-8b74-a1a3639cd505'
                }]);
                const revert = documentUploadMiddleware.__set__('returnError', sinon.spy());
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
                uploadDocumentServiceStub.returns(Promise.reject(new Error('Error: upload failed')));
                const revert = documentUploadMiddleware.__set__('returnError', sinon.spy());
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
                    expect(req.log.error.calledWith('Document upload failed: Error: Error: upload failed')).to.equal(true);
                    expect(documentUploadMiddleware.__get__('returnError').calledWith(req, res, next, error)).to.equal(true);
                    revert();
                    done();
                });
            });
        });
    });

    describe('removeDocument()', () => {
        let req;
        let removeDocumentStub;

        beforeEach(() => {
            req = {
                session: {
                    form: {
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
            removeDocumentStub = sinon.stub(services, 'removeDocument');
        });

        afterEach(() => {
            removeDocumentStub.restore();
        });

        it('should remove a document', (done) => {
            const res = {
                redirect: sinon.spy()
            };
            const next = {};
            removeDocumentStub.returns(Promise.resolve(true));
            documentUploadMiddleware.removeDocument(req, res, next);
            setTimeout(() => {
                expect(req.session.form.documents.uploads).to.deep.equal([]);
                expect(res.redirect.calledWith('/document-upload')).to.equal(true);
                done();
            });
        });

        it('should return an error if a document cannot be remvoved', (done) => {
            const res = {};
            const next = sinon.spy();
            const error = new Error('something');
            removeDocumentStub.returns(Promise.reject(error));
            documentUploadMiddleware.removeDocument(req, res, next);
            setTimeout(() => {
                expect(next.calledWith(error)).to.equal(true);
                done();
            });
        });
    });
});
