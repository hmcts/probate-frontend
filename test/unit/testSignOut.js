'use strict';

const initSteps = require('app/core/initSteps');
const assert = require('chai').assert;
const rewire = require('rewire');
const SignOut = rewire('app/steps/ui/signout');
const sinon = require('sinon');
const appConfig = require('config');
const SessionCleanupOutcomeEnum = require('app/utils/SessionCleanupOutcomeEnum');

describe('Sign-Out', () => {
    const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
    const IDAM_ACCESS_TOKEN_COOKIE = `__auth-token-${appConfig.payloadVersion}`;
    const expressSessionCookie = appConfig.redis?.cookie?.name || 'connect.sid';
    let rewireRestorers;
    let originalRewireSet;
    let section;
    let templatePath;
    let i18next;
    let schema;
    const getMessages = (spy) => spy.getCalls().map(call => call.args.join(' ')).join('\n');

    beforeEach(() => {
        rewireRestorers = [];
        originalRewireSet = SignOut.__set__;
        SignOut.__set__ = (...args) => {
            const rawRestorer = originalRewireSet(...args);
            const trackedRestorer = () => {
                if (trackedRestorer.restored) {
                    return;
                }
                trackedRestorer.restored = true;
                rawRestorer();
            };
            trackedRestorer.restored = false;
            rewireRestorers.push(trackedRestorer);
            return trackedRestorer;
        };
        rewireRestorers.push(() => {
            SignOut.__set__ = originalRewireSet;
        });
    });

    afterEach(() => {
        while (rewireRestorers.length > 0) {
            const restore = rewireRestorers.pop();
            restore();
        }
    });

    it('skips IDAM delete without auth cookie and still removes authToken, cookies and session data', () => {
        const loggerInfoSpy = sinon.spy();
        const revertLogger = SignOut.__set__('logger', {info: loggerInfoSpy, error: sinon.spy()});
        const sentinelToken = 'token-A';
        const sentinelSessionId = 'current-session-id';
        const sentinelUserId = 'immutable-idam-user-id';
        const sentinelRedisKey = 'redis:owner:key';
        const sentinelPathQueryValue = 'query-secret-signout';
        const sentinelUrl = `/sign-out?sentinel=${sentinelPathQueryValue}`;
        const idamDeleteStub = sinon.stub().resolves(200);
        const revert = SignOut.__set__('IdamSession', class {
            delete() {
                return idamDeleteStub();
            }
        });
        const clearIfCurrentStub = sinon.stub().resolves(1);
        let sessionConcurrencyOptions;
        const revertSessionConcurrency = SignOut.__set__('SessionConcurrency', class {
            constructor(options) {
                sessionConcurrencyOptions = options;
            }

            clearCurrentOwnerMappingOnSessionMatch(...args) {
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
            method: 'POST',
            path: '/',
            session: {
                idamUserId: sentinelUserId,
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
            sessionID: sentinelSessionId,
            authToken: sentinelToken
        };
        req.cookies.redis = sentinelRedisKey;
        req.originalUrl = sentinelUrl;
        const res = {
            clearCookie: sinon.spy()
        };
        const signOut = new SignOut(steps, section, templatePath, i18next, schema);

        return signOut.getContextData(req, res).then(() => {
            sinon.assert.notCalled(idamDeleteStub);
            sinon.assert.calledWith(clearIfCurrentStub, sessionStore, 'immutable-idam-user-id', 'current-session-id');
            assert.deepEqual(sessionConcurrencyOptions, {
                singleActiveSessionEnabled: appConfig.singleActiveSession && appConfig.singleActiveSession.enabled,
                mappingTtl: appConfig.singleActiveSession && appConfig.singleActiveSession.mappingTtl,
                redisEnabled: appConfig.redis && appConfig.redis.enabled
            });
            sinon.assert.calledTwice(res.clearCookie);
            sinon.assert.calledWith(res.clearCookie.firstCall, IDAM_ACCESS_TOKEN_COOKIE);
            sinon.assert.calledWith(res.clearCookie.secondCall, expressSessionCookie);
            assert.isUndefined(req.cookies);
            assert.isUndefined(req.sessionID);
            assert.isUndefined(req.session);
            assert.isUndefined(req.sessionStore);
            const lifecycleMessages = getMessages(loggerInfoSpy);
            const lifecycleMessagesByEvent = Object.fromEntries(
                loggerInfoSpy.getCalls()
                    .map(call => call.args.join(' '))
                    .map(message => [message.match(/(?:^| )event=([^ ]+)/)?.[1], message])
                    .filter(([eventName]) => Boolean(eventName))
            );
            assert.include(lifecycleMessages, 'event=manual_sign_out_started');
            assert.notInclude(lifecycleMessages, 'event=remote_idam_sign_out_attempted');
            assert.include(lifecycleMessages, 'event=ownership_mapping_cleanup_result');
            assert.include(lifecycleMessages, `ownershipMappingCleanupOutcome=${SessionCleanupOutcomeEnum.getCompleted()}`);
            assert.include(lifecycleMessages, 'event=local_sign_out_completed');
            assert.include(lifecycleMessagesByEvent.manual_sign_out_started, 'requestMethod=POST');
            assert.include(lifecycleMessagesByEvent.manual_sign_out_started, 'requestPath=/sign-out');
            assert.include(lifecycleMessagesByEvent.ownership_mapping_cleanup_result, 'requestPath=/sign-out');
            assert.include(lifecycleMessagesByEvent.local_sign_out_completed, 'requestPath=/sign-out');
            assert.notInclude(lifecycleMessagesByEvent.manual_sign_out_started, sentinelPathQueryValue);
            assert.notInclude(lifecycleMessagesByEvent.ownership_mapping_cleanup_result, sentinelPathQueryValue);
            assert.notInclude(lifecycleMessagesByEvent.local_sign_out_completed, sentinelPathQueryValue);
            assert.notInclude(lifecycleMessages, sentinelToken);
            assert.notInclude(lifecycleMessages, sentinelSessionId);
            assert.notInclude(lifecycleMessages, sentinelUserId);
            assert.notInclude(lifecycleMessages, sentinelRedisKey);
            assert.notInclude(lifecycleMessages, sentinelUrl);
            assert.notInclude(lifecycleMessages, sentinelPathQueryValue);
        });
    });

    it('continues local logout when Redis mapping cleanup fails', () => {
        const sentinelUrl = 'https://redis.example/session/token-sensitive';
        const loggerErrorSpy = sinon.spy();
        const loggerInfoSpy = sinon.spy();
        const revertLogger = SignOut.__set__('logger', {info: loggerInfoSpy, error: loggerErrorSpy});
        const revert = SignOut.__set__('IdamSession', class {
            delete() {
                return Promise.resolve(200);
            }
        });
        const revertSessionConcurrency = SignOut.__set__('SessionConcurrency', class {
            clearCurrentOwnerMappingOnSessionMatch() {
                const err = new Error(`redis failed ${sentinelUrl}`);
                err.code = 503;
                return Promise.reject(err);
            }
        });

        const req = {
            cookies: {},
            method: 'GET',
            path: '/sign-out',
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

        return signOut.getContextData(req, res).then(() => {
            assert.isUndefined(req.cookies);
            assert.isUndefined(req.sessionID);
            assert.isUndefined(req.session);
            assert.isUndefined(req.sessionStore);
            sinon.assert.calledTwice(res.clearCookie);
            sinon.assert.calledWith(res.clearCookie.firstCall, IDAM_ACCESS_TOKEN_COOKIE);
            sinon.assert.calledWith(res.clearCookie.secondCall, expressSessionCookie);
            const messages = loggerErrorSpy.getCalls().map(call => call.args.join(' ')).join('\n');
            assert.include(messages, 'Redis ownership cleanup failed during sign-out; continuing local sign-out (code: 503).');
            assert.notInclude(messages, sentinelUrl);
            const lifecycleMessages = getMessages(loggerInfoSpy);
            assert.include(lifecycleMessages, 'event=manual_sign_out_started');
            assert.notInclude(lifecycleMessages, 'event=remote_idam_sign_out_attempted');
            assert.include(lifecycleMessages, 'event=ownership_mapping_cleanup_result');
            assert.include(lifecycleMessages, `ownershipMappingCleanupOutcome=${SessionCleanupOutcomeEnum.getFailed()}`);
            assert.include(lifecycleMessages, 'event=local_sign_out_completed');
        });
    });

    it('continues local logout when IDAM sign-out fails', () => {
        const sentinelUrl = 'https://idam.example/session/abc123token';
        const loggerErrorSpy = sinon.spy();
        const loggerInfoSpy = sinon.spy();
        const revertLogger = SignOut.__set__('logger', {info: loggerInfoSpy, error: loggerErrorSpy});
        const revert = SignOut.__set__('IdamSession', class {
            delete() {
                const err = new Error(`idam unavailable ${sentinelUrl}`);
                err.name = 'IdamDeleteError';
                return Promise.reject(err);
            }
        });
        const clearIfCurrentStub = sinon.stub().resolves(0);
        const revertSessionConcurrency = SignOut.__set__('SessionConcurrency', class {
            clearCurrentOwnerMappingOnSessionMatch(...args) {
                return clearIfCurrentStub(...args);
            }
        });

        const sessionStore = {};
        const req = {
            cookies: {[IDAM_ACCESS_TOKEN_COOKIE]: 'token-A'},
            method: 'POST',
            path: '/sign-out',
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

        return signOut.getContextData(req, res).then(() => {
            sinon.assert.calledWith(clearIfCurrentStub, sessionStore, 'immutable-idam-user-id', 'current-session-id');
            sinon.assert.calledTwice(res.clearCookie);
            sinon.assert.calledWith(res.clearCookie.firstCall, IDAM_ACCESS_TOKEN_COOKIE);
            sinon.assert.calledWith(res.clearCookie.secondCall, expressSessionCookie);
            assert.isUndefined(req.cookies);
            assert.isUndefined(req.sessionID);
            assert.isUndefined(req.session);
            assert.isUndefined(req.sessionStore);
            const messages = loggerErrorSpy.getCalls().map(call => call.args.join(' ')).join('\n');
            assert.include(messages, 'Remote IDAM sign-out failed; continuing local sign-out.');
            assert.notInclude(messages, sentinelUrl);
            const lifecycleMessages = getMessages(loggerInfoSpy);
            assert.include(lifecycleMessages, 'event=manual_sign_out_started');
            assert.include(lifecycleMessages, 'event=remote_idam_sign_out_attempted');
            assert.include(lifecycleMessages, 'event=ownership_mapping_cleanup_result');
            assert.include(lifecycleMessages, `ownershipMappingCleanupOutcome=${SessionCleanupOutcomeEnum.getSkipped()}`);
            assert.include(lifecycleMessages, 'event=local_sign_out_completed');
        });
    });

    it('continues local logout when IDAM sign-out resolves to an Error object', () => {
        const sentinelUrl = 'https://idam.example/session/token-401';
        const loggerErrorSpy = sinon.spy();
        const loggerInfoSpy = sinon.spy();
        const revertLogger = SignOut.__set__('logger', {info: loggerInfoSpy, error: loggerErrorSpy});
        const revert = SignOut.__set__('IdamSession', class {
            delete() {
                return Promise.resolve(new Error('IDAM 401 empty response'));
            }
        });
        const clearIfCurrentStub = sinon.stub().resolves(1);
        const revertSessionConcurrency = SignOut.__set__('SessionConcurrency', class {
            clearCurrentOwnerMappingOnSessionMatch(...args) {
                return clearIfCurrentStub(...args);
            }
        });

        const sessionStore = {};
        const req = {
            cookies: {[IDAM_ACCESS_TOKEN_COOKIE]: `token-A-${sentinelUrl}`},
            method: 'POST',
            path: '/sign-out',
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

        return signOut.getContextData(req, res).then(() => {
            sinon.assert.calledWith(clearIfCurrentStub, sessionStore, 'immutable-idam-user-id', 'current-session-id');
            sinon.assert.calledTwice(res.clearCookie);
            sinon.assert.calledWith(res.clearCookie.firstCall, IDAM_ACCESS_TOKEN_COOKIE);
            sinon.assert.calledWith(res.clearCookie.secondCall, expressSessionCookie);
            assert.isUndefined(req.cookies);
            assert.isUndefined(req.sessionID);
            assert.isUndefined(req.session);
            assert.isUndefined(req.sessionStore);
            const messages = loggerErrorSpy.getCalls().map(call => call.args.join(' ')).join('\n');
            assert.include(messages, 'Remote IDAM sign-out failed; continuing local sign-out.');
            assert.notInclude(messages, sentinelUrl);
            const lifecycleMessages = getMessages(loggerInfoSpy);
            assert.include(lifecycleMessages, 'event=manual_sign_out_started');
            assert.include(lifecycleMessages, 'event=remote_idam_sign_out_attempted');
            assert.include(lifecycleMessages, 'event=ownership_mapping_cleanup_result');
            assert.include(lifecycleMessages, `ownershipMappingCleanupOutcome=${SessionCleanupOutcomeEnum.getCompleted()}`);
            assert.include(lifecycleMessages, 'event=local_sign_out_completed');
        });
    });

    it('continues local logout when session destroy fails', () => {
        const sentinelUrl = 'https://idam.example/session/token-98765';
        const loggerErrorSpy = sinon.spy();
        const loggerInfoSpy = sinon.spy();
        const revertLogger = SignOut.__set__('logger', {info: loggerInfoSpy, error: loggerErrorSpy});
        const revert = SignOut.__set__('IdamSession', class {
            delete() {
                return Promise.resolve(200);
            }
        });
        const clearIfCurrentStub = sinon.stub().resolves(1);
        const revertSessionConcurrency = SignOut.__set__('SessionConcurrency', class {
            clearCurrentOwnerMappingOnSessionMatch(...args) {
                return clearIfCurrentStub(...args);
            }
        });

        const sessionStore = {};
        const req = {
            cookies: {[IDAM_ACCESS_TOKEN_COOKIE]: 'token-A'},
            method: 'POST',
            path: '/sign-out',
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

        return signOut.getContextData(req, res).then(() => {
            sinon.assert.calledWith(clearIfCurrentStub, sessionStore, 'immutable-idam-user-id', 'current-session-id');
            sinon.assert.calledTwice(res.clearCookie);
            sinon.assert.calledWith(res.clearCookie.firstCall, IDAM_ACCESS_TOKEN_COOKIE);
            sinon.assert.calledWith(res.clearCookie.secondCall, expressSessionCookie);
            assert.isUndefined(req.cookies);
            assert.isUndefined(req.sessionID);
            assert.isUndefined(req.session);
            assert.isUndefined(req.sessionStore);
            const messages = loggerErrorSpy.getCalls().map(call => call.args.join(' ')).join('\n');
            assert.include(messages, 'Express session destruction failed during sign-out; continuing cookie cleanup.');
            assert.notInclude(messages, sentinelUrl);
            const lifecycleMessages = getMessages(loggerInfoSpy);
            assert.include(lifecycleMessages, 'event=manual_sign_out_started');
            assert.include(lifecycleMessages, 'event=remote_idam_sign_out_attempted');
            assert.include(lifecycleMessages, 'event=ownership_mapping_cleanup_result');
            assert.include(lifecycleMessages, `ownershipMappingCleanupOutcome=${SessionCleanupOutcomeEnum.getCompleted()}`);
            assert.include(lifecycleMessages, 'event=local_sign_out_completed');
        });
    });

    it('test correct url is returned from getUrl function', () => {
        assert.equal(SignOut.getUrl(), '/sign-out');
    });
});
