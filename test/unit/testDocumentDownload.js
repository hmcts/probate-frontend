'use strict';

const sinon = require('sinon');
const pdfservices = require('app/components/pdf-services');
const chai = require('chai');
chai.use(require('chai-string'));
const app = require('app');
const request = require('supertest');
const expect = chai.expect;
let pdfServicesStub;

describe('DocumentDownload.js', () => {

    afterEach(() => {
        pdfServicesStub.restore();
    });

    describe('/check-answers-pdf', () => {

        beforeEach(() => {
            pdfServicesStub = sinon.stub(pdfservices, 'createCheckAnswersPdf');
        });

        it('should return the headers', (done) => {
            pdfServicesStub.returns(Promise.resolve('some bytes'));
            const server = app.init();
            const agent = request.agent(server.app);
            agent.get('/check-answers-pdf')
                .expect(200)
                .end((err, res) => {
                    server.http.close();
                    if (err) {
                        throw err;
                    }
                    expect(res.get('Content-Type')).equal('application/pdf; charset=utf-8');
                    expect(res.get('Content-Disposition')).equal('attachment; filename=check-your-answers.pdf');
                    done();
                });
        });

        it('should catch error which is renders as errors/500', (done) => {
            pdfServicesStub.throws();
            const server = app.init();
            const agent = request.agent(server.app);
            agent.get('/check-answers-pdf')
                .expect(500)
                .end((err, res) => {
                    server.http.close();
                    if (err) {
                        throw err;
                    }
                    expect(res.text).to.containIgnoreCase('<!DOCTYPE html>');
                    expect(res.text).to.containIgnoreCase('Sorry, we&rsquo;re having technical problems');
                    done();
                });
        });
    });

    describe('/declaration-pdf', () => {

        beforeEach(() => {
            pdfServicesStub = sinon.stub(pdfservices, 'createDeclarationPdf');
        });

        it('should return the headers', (done) => {
            pdfServicesStub.returns(Promise.resolve('some bytes'));
            const server = app.init();
            const agent = request.agent(server.app);
            agent.get('/declaration-pdf')
                .expect(200)
                .end((err, res) => {
                    server.http.close();
                    if (err) {
                        throw err;
                    }
                    expect(res.get('Content-Type')).equal('application/pdf; charset=utf-8');
                    expect(res.get('Content-Disposition')).equal('attachment; filename=legal-declaration.pdf');
                    done();
                });
        });

        it('should catch error which is renders as errors/500', (done) => {
            pdfServicesStub.throws();
            const server = app.init();
            const agent = request.agent(server.app);
            agent.get('/declaration-pdf')
                .expect(500)
                .end((err, res) => {
                    server.http.close();
                    if (err) {
                        throw err;
                    }
                    expect(res.text).to.containIgnoreCase('<!DOCTYPE html>');
                    expect(res.text).to.containIgnoreCase('Sorry, we&rsquo;re having technical problems');
                    done();
                });
        });
    });

    describe('/cover-sheet-pdf', () => {

        beforeEach(() => {
            pdfServicesStub = sinon.stub(pdfservices, 'createCoverSheetPdf');
        });

        it('should return the headers', (done) => {
            pdfServicesStub.returns(Promise.resolve('some bytes'));
            const server = app.init();
            const agent = request.agent(server.app);
            agent.get('/cover-sheet-pdf')
                .expect(200)
                .end((err, res) => {
                    server.http.close();
                    if (err) {
                        throw err;
                    }
                    expect(res.get('Content-Type')).equal('application/pdf; charset=utf-8');
                    expect(res.get('Content-Disposition')).equal('attachment; filename=coverSheet.pdf');
                    done();
                });
        });

        it('should catch error which is renders as errors/500', (done) => {
            pdfServicesStub.throws();
            const server = app.init();
            const agent = request.agent(server.app);
            agent.get('/cover-sheet-pdf')
                .expect(500)
                .end((err, res) => {
                    server.http.close();
                    if (err) {
                        throw err;
                    }
                    expect(res.text).to.containIgnoreCase('<!DOCTYPE html>');
                    expect(res.text).to.containIgnoreCase('Sorry, we&rsquo;re having technical problems');
                    done();
                });
        });
    });
});
