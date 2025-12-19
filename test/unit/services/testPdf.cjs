'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const nock = require('nock');
const co = require('co');
const rewire = require('rewire');
const Pdf = rewire('app/services/Pdf');
const config = require('config');

describe('PdfService', () => {
    describe('post()', () => {

        afterEach(() => {
            nock.cleanAll();
        });

        it('should call super.post()', (done) => {
            const endpoint = 'http://localhost';
            const pdfTemplate = config.pdf.template.coverSheet;
            const body = {hello: 'sir'};
            const sessionId = '1234';
            const authToken = 'auth_token';
            const serviceToken = 'service_token';
            const req = {
                sessionID: sessionId,
                authToken: authToken,
                session: {
                    serviceAuthorization: serviceToken
                }
            };
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': authToken,
                'ServiceAuthorization': serviceToken
            };
            const logMessage = 'Post probate pdf';
            const expected = {result: 'this is the result'};
            const path = config.pdf.path + '/' + pdfTemplate;
            nock(endpoint, {reqheaders: headers}).post(path, body)
                .times(1)
                .reply(200, expected);
            const revert = Pdf.__set__('Authorise', class {
                post() {
                    return Promise.resolve(serviceToken);
                }
            });
            const probatePdf = new Pdf(endpoint, 'abc123');
            probatePdf.log = sinon.spy();

            co(function* () {
                const actual = yield probatePdf.post(pdfTemplate, body, logMessage, req);
                expect(actual).to.not.equal(null);
                expect(probatePdf.log.calledWith(logMessage)).to.equal(true);
                expect(nock.isDone()).to.equal(true);
                revert();
                done();
            });
        });

        it('should throw error when pdf service call is unsuccessful', (done) => {
            const endpoint = 'http://localhost';
            const pdfTemplate = config.pdf.template.coverSheet;
            const body = {hello: 'sir'};
            const sessionId = '1234';
            const authToken = 'auth_token';
            const serviceToken = 'service_token';
            const req = {
                sessionID: sessionId,
                authToken: authToken,
                session: {
                    serviceAuthorization: serviceToken
                }
            };
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': authToken,
                'ServiceAuthorization': serviceToken
            };
            const logMessage = 'Post probate pdf';
            const expected = {result: 'this is the result'};
            const path = config.pdf.path + '/' + pdfTemplate;
            nock(endpoint, {reqheaders: headers}).post(path, body)
                .times(1)
                .reply(500, expected);
            const revert = Pdf.__set__('Authorise', class {
                post() {
                    return Promise.resolve(serviceToken);
                }
            });
            const probatePdf = new Pdf(endpoint, 'abc123');
            probatePdf.log = sinon.spy();

            probatePdf
                .post(pdfTemplate, body, logMessage, req)
                .catch(() => {
                    expect(probatePdf.log.calledWith(logMessage)).to.equal(true);
                    expect(probatePdf.post).to.throw(Error);
                    expect(nock.isDone()).to.equal(true);
                    revert();
                    done();
                });
        });
    });
});
