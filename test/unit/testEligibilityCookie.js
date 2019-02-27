// eslint-disable-line max-lines

'use strict';

const rewire = require('rewire');
const EligibilityCookie = rewire('app/utils/EligibilityCookie');
const expect = require('chai').expect;
const sinon = require('sinon');
const config = require('app/config');

describe('EligibilityCookie.js', () => {
    describe('checkCookie()', () => {
        it('should redirect if the eligibility cookie does not exist', (done) => {
            const req = {cookies: {}};
            const res = {redirect: sinon.spy()};
            const next = {};
            const eligibilityCookie = new EligibilityCookie();

            eligibilityCookie.checkCookie()(req, res, next);

            expect(res.redirect.calledOnce).to.equal(true);
            expect(res.redirect.calledWith('/start-eligibility')).to.equal(true);

            done();
        });

        it('should redirect if the specified page does not exist in the eligibility cookie', (done) => {
            const req = {
                cookies: {
                    __eligibility: JSON.stringify({
                        nextStepUrl: '/will-original',
                        pages: {
                            '/death-certificate': {deathCertificate: 'Yes'},
                            '/deceased-domicile': {domicile: 'Yes'},
                            '/iht-completed': {completed: 'Yes'},
                            '/will-left': {left: 'Yes'}
                        }
                    })
                },
                originalUrl: '/applicant-executor'
            };
            const res = {redirect: sinon.spy()};
            const next = {};
            const eligibilityCookie = new EligibilityCookie();

            eligibilityCookie.checkCookie()(req, res, next);

            expect(res.redirect.calledOnce).to.equal(true);
            expect(res.redirect.calledWith('/start-eligibility')).to.equal(true);

            done();
        });

        it('should continue if the specified page exists in the eligibility cookie', (done) => {
            const req = {
                cookies: {
                    __eligibility: JSON.stringify({
                        nextStepUrl: '/will-original',
                        pages: {
                            '/death-certificate': {deathCertificate: 'Yes'},
                            '/deceased-domicile': {domicile: 'Yes'},
                            '/iht-completed': {completed: 'Yes'},
                            '/will-left': {left: 'Yes'}
                        }
                    })
                },
                originalUrl: '/iht-completed'
            };
            const res = {};
            const next = sinon.spy();
            const eligibilityCookie = new EligibilityCookie();

            eligibilityCookie.checkCookie()(req, res, next);

            expect(next.calledOnce).to.equal(true);

            done();
        });

        it('should continue if the specified page exists is the next step', (done) => {
            const req = {
                cookies: {
                    __eligibility: JSON.stringify({
                        nextStepUrl: '/will-original',
                        pages: {
                            '/death-certificate': {deathCertificate: 'Yes'},
                            '/deceased-domicile': {domicile: 'Yes'},
                            '/iht-completed': {completed: 'Yes'},
                            '/will-left': {left: 'Yes'}
                        }
                    })
                },
                originalUrl: '/will-original'
            };
            const res = {};
            const next = sinon.spy();
            const eligibilityCookie = new EligibilityCookie();

            eligibilityCookie.checkCookie()(req, res, next);

            expect(next.calledOnce).to.equal(true);

            done();
        });
    });

    describe('setCookie()', () => {
        it('should add or update the next step and the current page in the cookie ', (done) => {
            const req = {originalUrl: '/iht-completed'};
            const res = {};
            const nextStepUrl = '/will-original';
            const fieldKey = 'completed';
            const fieldValue = 'Yes';
            const eligibilityCookie = new EligibilityCookie();
            const readCookieStub = sinon.stub(eligibilityCookie, 'readCookie').returns({
                nextStepUrl: '/will-original',
                pages: {
                    '/death-certificate': {deathCertificate: 'Yes'},
                    '/deceased-domicile': {domicile: 'Yes'},
                    '/iht-completed': {completed: 'Yes'},
                    '/will-left': {left: 'Yes'}
                }
            });
            const writeCookieStub = sinon.stub(eligibilityCookie, 'writeCookie');

            eligibilityCookie.setCookie(req, res, nextStepUrl, fieldKey, fieldValue);

            expect(eligibilityCookie.writeCookie.calledOnce).to.equal(true);
            expect(eligibilityCookie.writeCookie.calledWith(
                {originalUrl: '/iht-completed'},
                {},
                {
                    nextStepUrl: '/will-original',
                    pages: {
                        '/death-certificate': {'deathCertificate': 'Yes'},
                        '/deceased-domicile': {'domicile': 'Yes'},
                        '/iht-completed': {'completed': 'Yes'},
                        '/will-left': {'left': 'Yes'}
                    }
                }
            )).to.equal(true);

            readCookieStub.restore();
            writeCookieStub.restore();
            done();
        });
    });

    describe('readCookie()', () => {
        it('should return a default json object if the eligibility cookie does not exist', (done) => {
            const req = {};
            const eligibilityCookie = new EligibilityCookie();
            const json = eligibilityCookie.readCookie(req);

            expect(json).to.deep.equal({
                nextStepUrl: '',
                pages: {}
            });

            done();
        });

        it('should return a json object of the eligibility cookie if the eligibility cookie exists', (done) => {
            const req = {
                cookies: {
                    __eligibility: JSON.stringify({
                        nextStepUrl: '/will-original',
                        pages: {
                            '/death-certificate': {deathCertificate: 'Yes'},
                            '/deceased-domicile': {domicile: 'Yes'},
                            '/iht-completed': {completed: 'Yes'},
                            '/will-left': {left: 'Yes'}
                        }
                    })
                }
            };
            const eligibilityCookie = new EligibilityCookie();
            const json = eligibilityCookie.readCookie(req);

            expect(json).to.deep.equal({
                nextStepUrl: '/will-original',
                pages: {
                    '/death-certificate': {deathCertificate: 'Yes'},
                    '/deceased-domicile': {domicile: 'Yes'},
                    '/iht-completed': {completed: 'Yes'},
                    '/will-left': {left: 'Yes'}
                }
            });

            done();
        });
    });

    describe('getAnswer()', () => {
        it('should return an existing answer', (done) => {
            const req = {
                cookies: {
                    __eligibility: JSON.stringify({
                        nextStepUrl: '/will-original',
                        pages: {
                            '/death-certificate': {deathCertificate: 'Yes'}
                        }
                    })
                },
                originalUrl: '/death-certificate'
            };
            const pageUrl = '/death-certificate';
            const fieldKey = 'deathCertificate';

            const eligibilityCookie = new EligibilityCookie();
            const answer = eligibilityCookie.getAnswer(req, pageUrl, fieldKey);

            expect(answer).to.equal('Yes');

            done();
        });

        it('should return null', (done) => {
            const req = {
                cookies: {},
                originalUrl: '/death-certificate'
            };
            const pageUrl = '/death-certificate';
            const fieldKey = 'deathCertificate';

            const eligibilityCookie = new EligibilityCookie();
            const answer = eligibilityCookie.getAnswer(req, pageUrl, fieldKey);

            expect(answer).to.equal(null);

            done();
        });
    });

    describe('writeCookie()', () => {
        let cookieExpires;
        let revert;

        beforeEach(() => {
            cookieExpires = new Date(Date.now() + config.redis.eligibilityCookie.expires);
            revert = EligibilityCookie.__set__('cookieExpires', cookieExpires);
        });

        afterEach(() => {
            revert();
        });

        it('should set a cookie on https', (done) => {

            const req = {protocol: 'https'};
            const res = {cookie: sinon.spy()};
            const json = {
                nextStepUrl: '/will-original',
                pages: {
                    '/death-certificate': {deathCertificate: 'Yes'},
                    '/deceased-domicile': {domicile: 'Yes'},
                    '/iht-completed': {completed: 'Yes'},
                    '/will-left': {left: 'Yes'}
                }
            };
            const eligibilityCookie = new EligibilityCookie();

            eligibilityCookie.writeCookie(req, res, json);

            expect(res.cookie.calledOnce).to.equal(true);
            expect(res.cookie.calledWith(
                config.redis.eligibilityCookie.name,
                JSON.stringify({
                    nextStepUrl: '/will-original',
                    pages: {
                        '/death-certificate': {deathCertificate: 'Yes'},
                        '/deceased-domicile': {domicile: 'Yes'},
                        '/iht-completed': {completed: 'Yes'},
                        '/will-left': {left: 'Yes'}
                    }
                }),
                {httpOnly: true, secure: true, expires: cookieExpires, maxAge: config.redis.eligibilityCookie.expires}
            )).to.equal(true);

            done();
        });

        it('should set a cookie on http', (done) => {
            const req = {};
            const res = {cookie: sinon.spy()};
            const json = {
                nextStepUrl: '/will-original',
                pages: {
                    '/death-certificate': {deathCertificate: 'Yes'},
                    '/deceased-domicile': {domicile: 'Yes'},
                    '/iht-completed': {completed: 'Yes'},
                    '/will-left': {left: 'Yes'}
                }
            };
            const eligibilityCookie = new EligibilityCookie();

            eligibilityCookie.writeCookie(req, res, json);

            expect(res.cookie.calledOnce).to.equal(true);
            expect(res.cookie.calledWith(
                config.redis.eligibilityCookie.name,
                JSON.stringify({
                    nextStepUrl: '/will-original',
                    pages: {
                        '/death-certificate': {deathCertificate: 'Yes'},
                        '/deceased-domicile': {domicile: 'Yes'},
                        '/iht-completed': {completed: 'Yes'},
                        '/will-left': {left: 'Yes'}
                    }
                }),
                {httpOnly: true, expires: cookieExpires, maxAge: config.redis.eligibilityCookie.expires}
            )).to.equal(true);

            done();
        });
    });
});
