'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const rewire = require('rewire');
const Pdf = rewire('app/services/Pdf');
const config = require('app/config').pdf;

describe('PdfService', () => {
    describe('post()', () => {
        let body;
        let logMessage;
        let headers;
        let url;
        let hostname;

        beforeEach(() => {
            body = {};
            logMessage = 'Post probate pdf';
            headers = {
                'Content-Type': 'application/json'
            };
            hostname = 'http://localhost';
            url = `${hostname}/${config.path}/${config.template.coverSheet}`;
        });

        it('should call fetchOptions and fetchBuffer if Authorise returns a successful result', (done) => {
            const serviceToken = 'tok123';
            const revert = Pdf.__set__('Authorise', class {
                post() {
                    return Promise.resolve(serviceToken);
                }
            });
            const fetchOptions = {method: 'POST'};
            const pdf = new Pdf(hostname, 'abc123');

            pdf.log = sinon.spy();
            pdf.fetchOptions = sinon.stub().returns(fetchOptions);
            pdf.fetchBuffer = sinon.spy();

            pdf
                .post(body, logMessage, headers, url)
                .then(() => {
                    expect(pdf.log.calledOnce).to.equal(true);
                    expect(pdf.log.calledWith(logMessage)).to.equal(true);
                    expect(pdf.fetchOptions.calledOnce).to.equal(true);
                    expect(pdf.fetchOptions.calledWith({}, 'POST', {
                        'Content-Type': 'application/json',
                        'ServiceAuthorization': serviceToken
                    })).to.equal(true);
                    expect(pdf.fetchBuffer.calledOnce).to.equal(true);
                    expect(pdf.fetchBuffer.calledWith(url, fetchOptions)).to.equal(true);

                    revert();
                    done();
                });
        });

        it('should log an error if Authorise returns an error', (done) => {
            const error = new Error('Internal service error');
            const revert = Pdf.__set__('Authorise', class {
                post() {
                    return Promise.reject(error);
                }
            });
            const pdf = new Pdf(hostname, 'abc123');

            pdf.log = sinon.spy();

            pdf
                .post(body, logMessage, headers, url)
                .then(() => {
                    expect(pdf.log.calledTwice).to.equal(true);
                    expect(pdf.log.calledWith(logMessage)).to.equal(true);
                    expect(pdf.log.calledWith(error, 'error')).to.equal(true);

                    revert();
                    done();
                });
        });
    });
});
