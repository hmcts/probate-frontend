'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const rewire = require('rewire');
const documentDownload = rewire('app/middleware/documentDownload');
const probateJourney = require('app/journeys/probate');
const caseTypes = require('app/utils/CaseTypes');

describe('DocumentDownloadMiddleware', () => {
    describe('documentDownload()', () => {
        let req;
        let res;
        let service;
        let filename;

        beforeEach(() => {
            req = {
                session: {
                    language: 'en',
                    journey: probateJourney,
                    form: {
                        caseType: caseTypes.GOP
                    }
                },
                log: {
                    error: sinon.spy()
                }
            };
            res = {
                setHeader: sinon.spy(),
                send: sinon.spy(),
                status: sinon.stub().returns({render: sinon.stub()})
            };
            service = 'CheckAnswersPdf';
            filename = 'check-your-answers.pdf';
        });

        it('should call res.setHeader and res.send if the response is successful', (done) => {
            documentDownload.__set__('ServiceMapper', class {
                static map() {
                    return class {
                        static post() {
                            return Promise.resolve('Success!');
                        }
                    };
                }
            });

            documentDownload(req, res, service, filename);

            setTimeout(() => {
                expect(res.setHeader.calledTwice).to.equal(true);
                expect(res.setHeader.calledWith('Content-Type', 'application/pdf')).to.equal(true);
                expect(res.setHeader.calledWith('Content-disposition', `attachment; filename=${filename}`)).to.equal(true);
                expect(res.send.calledOnce).to.equal(true);
                expect(res.send.calledWith('Success!')).to.equal(true);
                done();
            });
        });

        it('should log an error and display an error page if the response failed', (done) => {
            const error = new Error('Internal server error');

            documentDownload.__set__('ServiceMapper', class {
                static map() {
                    return class {
                        static post() {
                            return Promise.reject(error);
                        }
                    };
                }
            });

            documentDownload(req, res, service, filename);

            setTimeout(() => {
                expect(req.log.error.calledOnce).to.equal(true);
                expect(req.log.error.calledWith(error)).to.equal(true);
                expect(res.status.calledOnce).to.equal(true);
                expect(res.status.calledWith(500)).to.equal(true);
                done();
            });
        });
    });
});
