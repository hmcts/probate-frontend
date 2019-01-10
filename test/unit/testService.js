'use strict';

const {expect} = require('chai');
const rewire = require('rewire');
const Service = rewire('app/services/Service');
const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');
// const sinon = require('sinon');

describe('Service', () => {
    describe('get()', () => {
        it('should throw a reference error', (done) => {
            const service = new Service();
            expect(service.get).to.throw(ReferenceError, 'get() must be overridden when extending Service');
            done();
        });
    });

    describe('post()', () => {
        it('should throw a reference error', (done) => {
            const service = new Service();
            expect(service.post).to.throw(ReferenceError, 'post() must be overridden when extending Service');
            done();
        });
    });

    describe('patch()', () => {
        it('should throw a reference error', (done) => {
            const service = new Service();
            expect(service.patch).to.throw(ReferenceError, 'patch() must be overridden when extending Service');
            done();
        });
    });

    describe('delete()', () => {
        it('should throw a reference error', (done) => {
            const service = new Service();
            expect(service.delete).to.throw(ReferenceError, 'delete() must be overridden when extending Service');
            done();
        });
    });

    // describe('log()', () => {
    //     it('should log a message', (done) => {
    //         const revert = Service.__set__('logger', () => sinon.spy());
    //         const service = new Service();
    //         service.log();
    //         expect(Service.__get__('logger()').calledOnce).to.equal(true);
    //         revert();
    //         done();
    //     });
    // });

    describe('replaceEmailInPath()', () => {
        it('should replace the applicantEmail token with an email address', (done) => {
            const path = '/forms/{applicantEmail}';
            const email = 'fred@example.com';
            const service = new Service();
            const newPath = service.replaceEmailInPath(path, email);
            expect(newPath).to.equal('/forms/fred@example.com');
            done();
        });
    });

    describe('fetchJson()', () => {
        it('should return a json response', (done) => {
            const revert = Service.__set__('asyncFetch', class {
                static fetch() {
                    return Promise.resolve({result: 'something'});
                }
            });
            const service = new Service();
            service
                .fetchJson('http://localhost/forms', {})
                .then((res) => {
                    expect(res).to.deep.equal({result: 'something'});
                    revert();
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });
    });

    describe('fetchText()', () => {
        it('should return a text response', (done) => {
            const revert = Service.__set__('asyncFetch', class {
                static fetch() {
                    return Promise.resolve('something');
                }
            });
            const service = new Service();
            service
                .fetchText('http://localhost/forms', {})
                .then((res) => {
                    expect(res).to.equal('something');
                    revert();
                    done();
                })
                .catch((err) => {
                    done(err);
                });
        });
    });

    describe('fetchOptions()', () => {
        it('should return the fetch options', (done) => {
            const data = {
                fullName: 'Fred Miller'
            };
            const method = 'POST';
            const headers = {
                'Content-Type': 'application/json'
            };
            const proxy = 'http://localhost';
            const service = new Service();
            const options = service.fetchOptions(data, method, headers, proxy);
            expect(options).to.deep.equal({
                method: 'POST',
                mode: 'cors',
                redirect: 'follow',
                follow: 10,
                timeout: 10000,
                body: JSON.stringify(data),
                headers: new fetch.Headers(headers),
                agent: new HttpsProxyAgent(proxy)
            });
            done();
        });

        it('should return the agent set to null if a proxy is not given', (done) => {
            const service = new Service();
            const options = service.fetchOptions();
            expect(options.agent).to.equal(null);
            done();
        });
    });
});
