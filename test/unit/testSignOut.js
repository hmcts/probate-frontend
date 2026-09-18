'use strict';

const initSteps = require('app/core/initSteps');
const assert = require('chai').assert;
const rewire = require('rewire');
const SignOut = rewire('app/steps/ui/signout');
const sinon = require('sinon');
const appConfig = require('config');

describe('Sign-Out', () => {
    const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
    const securityCookie = `__auth-token-${appConfig.payloadVersion}`;
    const expressSessionCookie = appConfig.redis?.cookie?.name || 'connect.sid';
    let section;
    let templatePath;
    let i18next;
    let schema;

    it('test authToken, cookies and session data have been removed from the session', (done) => {
        const revert = SignOut.__set__('IdamSession', class {
            delete() {
                return Promise.resolve(200);
            }
        });
        const clearIfCurrentStub = sinon.stub().resolves();
        const revertSessionConcurrency = SignOut.__set__('SessionConcurrency', class {
            clearIfCurrent(...args) {
                return clearIfCurrentStub(...args);
            }
        });

        section = 'applicant';
        templatePath = 'addressLookup';
        i18next = {};
        schema = {
            $schema: 'http://json-schema.org/draft-07/schema',
            properties: {}
        };

        const sessionStore = {
            applicantID: 'test@email.com'
        };
        const req = {
            cookies: {
                _ga: 'dummy_ga',
                _gid: 'dummy_gid',
                _gat: '1'
            },
            session: {
                idamUserId: 'immutable-idam-user-id',
                form: {
                    payloadVersion: '4.1.0',
                    applicantEmail: 'test@email.com'
                },
                destroy: callback => {
                    delete req.session;
                    delete req.sessionStore;
                    callback();
                }
            },
            sessionStore,
            sessionID: 'current-session-id'
        };
        const res = {
            clearCookie: sinon.spy()
        };
        const signOut = new SignOut(steps, section, templatePath, i18next, schema);

        signOut.getContextData(req, res).then(() => {
            sinon.assert.calledWith(clearIfCurrentStub, sessionStore, 'immutable-idam-user-id', 'current-session-id');
            sinon.assert.calledTwice(res.clearCookie);
            sinon.assert.calledWith(res.clearCookie.firstCall, securityCookie);
            sinon.assert.calledWith(res.clearCookie.secondCall, expressSessionCookie);
            assert.isUndefined(req.cookies);
            assert.isUndefined(req.sessionID);
            assert.isUndefined(req.session);
            assert.isUndefined(req.sessionStore);
            revert();
            revertSessionConcurrency();
            done();
        });
    });

    it('continues local logout when Redis mapping cleanup fails', (done) => {
        const revert = SignOut.__set__('IdamSession', class {
            delete() {
                return Promise.resolve(200);
            }
        });
        const revertSessionConcurrency = SignOut.__set__('SessionConcurrency', class {
            clearIfCurrent() {
                return Promise.reject(new Error('redis failed'));
            }
        });

        const req = {
            cookies: {},
            session: {
                idamUserId: 'immutable-idam-user-id',
                form: {},
                destroy: callback => {
                    delete req.session;
                    delete req.sessionStore;
                    callback();
                }
            },
            sessionStore: {},
            sessionID: 'current-session-id'
        };
        const res = {
            clearCookie: sinon.spy()
        };
        const signOut = new SignOut(steps, 'applicant', 'addressLookup', {}, {properties: {}});

        signOut.getContextData(req, res).then(() => {
            assert.isUndefined(req.cookies);
            assert.isUndefined(req.sessionID);
            assert.isUndefined(req.session);
            assert.isUndefined(req.sessionStore);
            sinon.assert.calledTwice(res.clearCookie);
            sinon.assert.calledWith(res.clearCookie.firstCall, securityCookie);
            sinon.assert.calledWith(res.clearCookie.secondCall, expressSessionCookie);
            revert();
            revertSessionConcurrency();
            done();
        });
    });

    it('continues local logout when IDAM sign-out fails', (done) => {
        const sentinelUrl = 'https://idam.example/session/abc123token';
        const loggerErrorSpy = sinon.spy();
        const revertLogger = SignOut.__set__('logger', {error: loggerErrorSpy});
        const revert = SignOut.__set__('IdamSession', class {
            delete() {
                const err = new Error(`idam unavailable ${sentinelUrl}`);
                err.name = 'IdamDeleteError';
                return Promise.reject(err);
            }
        });
        const clearIfCurrentStub = sinon.stub().resolves();
        const revertSessionConcurrency = SignOut.__set__('SessionConcurrency', class {
            clearIfCurrent(...args) {
                return clearIfCurrentStub(...args);
            }
        });

        const sessionStore = {};
        const req = {
            cookies: {[securityCookie]: 'token-A'},
            session: {
                idamUserId: 'immutable-idam-user-id',
                form: {caseType: 'gop'},
                destroy: callback => {
                    delete req.session;
                    delete req.sessionStore;
                    callback();
                }
            },
            sessionStore,
            sessionID: 'current-session-id'
        };
        const res = {
            clearCookie: sinon.spy()
        };
        const signOut = new SignOut(steps, 'applicant', 'addressLookup', {}, {properties: {}});

        signOut.getContextData(req, res).then(() => {
            sinon.assert.calledWith(clearIfCurrentStub, sessionStore, 'immutable-idam-user-id', 'current-session-id');
            sinon.assert.calledTwice(res.clearCookie);
            sinon.assert.calledWith(res.clearCookie.firstCall, securityCookie);
            sinon.assert.calledWith(res.clearCookie.secondCall, expressSessionCookie);
            assert.isUndefined(req.cookies);
            assert.isUndefined(req.sessionID);
            assert.isUndefined(req.session);
            assert.isUndefined(req.sessionStore);
            const messages = loggerErrorSpy.getCalls().map(call => call.args.join(' ')).join('\n');
            assert.include(messages, 'Error while calling IDAM (IdamDeleteError).');
            assert.notInclude(messages, sentinelUrl);
            revert();
            revertSessionConcurrency();
            revertLogger();
            done();
        });
    });

    it('continues local logout when session destroy fails', (done) => {
        const sentinelUrl = 'https://idam.example/session/token-98765';
        const loggerErrorSpy = sinon.spy();
        const revertLogger = SignOut.__set__('logger', {error: loggerErrorSpy});
        const revert = SignOut.__set__('IdamSession', class {
            delete() {
                return Promise.resolve(200);
            }
        });
        const clearIfCurrentStub = sinon.stub().resolves();
        const revertSessionConcurrency = SignOut.__set__('SessionConcurrency', class {
            clearIfCurrent(...args) {
                return clearIfCurrentStub(...args);
            }
        });

        const sessionStore = {};
        const req = {
            cookies: {[securityCookie]: 'token-A'},
            session: {
                idamUserId: 'immutable-idam-user-id',
                form: {caseType: 'gop'},
                destroy: callback => {
                    const err = new Error(`store unavailable ${sentinelUrl}`);
                    err.name = 'SessionStoreError';
                    callback(err);
                }
            },
            sessionStore,
            sessionID: 'current-session-id'
        };
        const res = {
            clearCookie: sinon.spy()
        };
        const signOut = new SignOut(steps, 'applicant', 'addressLookup', {}, {properties: {}});

        signOut.getContextData(req, res).then(() => {
            sinon.assert.calledWith(clearIfCurrentStub, sessionStore, 'immutable-idam-user-id', 'current-session-id');
            sinon.assert.calledTwice(res.clearCookie);
            sinon.assert.calledWith(res.clearCookie.firstCall, securityCookie);
            sinon.assert.calledWith(res.clearCookie.secondCall, expressSessionCookie);
            assert.isUndefined(req.cookies);
            assert.isUndefined(req.sessionID);
            assert.isUndefined(req.session);
            assert.isUndefined(req.sessionStore);
            const messages = loggerErrorSpy.getCalls().map(call => call.args.join(' ')).join('\n');
            assert.include(messages, 'Unable to destroy local session on sign-out (SessionStoreError).');
            assert.notInclude(messages, sentinelUrl);
            revert();
            revertSessionConcurrency();
            revertLogger();
            done();
        });
    });

    it('test correct url is returned from getUrl function', () => {
        assert.equal(SignOut.getUrl(), '/sign-out');
    });
});
