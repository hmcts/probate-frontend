'use strict';

const initSteps = require('app/core/initSteps');
const assert = require('chai').assert;
const rewire = require('rewire');
const SignOut = rewire('app/steps/ui/signout');
const sinon = require('sinon');

describe('Sign-Out', () => {
    const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
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
                destroy: () => {
                    delete req.session;
                    delete req.sessionStore;
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
                destroy: () => {
                    delete req.session;
                    delete req.sessionStore;
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
            sinon.assert.calledOnce(res.clearCookie);
            revert();
            revertSessionConcurrency();
            done();
        });
    });

    it('test correct url is returned from getUrl function', () => {
        assert.equal(SignOut.getUrl(), '/sign-out');
    });
});
