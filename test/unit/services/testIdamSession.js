'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const IdamSession = require('app/services/IdamSession');
const AsyncFetch = require('app/utils/AsyncFetch');

describe('IdamSessionService', () => {
    describe('get()', () => {
        it('should call log() and fetchJson()', (done) => {
            const endpoint = '';
            const fetchOptions = {method: 'GET'};
            const idamSession = new IdamSession(endpoint, 'abc123');
            const logSpy = sinon.spy(idamSession, 'log');
            const fetchJsonSpy = sinon.stub(AsyncFetch, 'fetchJson');
            const fetchOptionsStub = sinon.stub(AsyncFetch, 'fetchOptions').returns(fetchOptions);

            idamSession.get('sec123');

            expect(idamSession.log.calledOnce).to.equal(true);
            expect(idamSession.log.calledWith('Get idam session')).to.equal(true);
            expect(AsyncFetch.fetchJson.calledOnce).to.equal(true);
            expect(AsyncFetch.fetchJson.calledWith(`${endpoint}/details`, fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchJsonSpy.restore();
            fetchOptionsStub.restore();
            done();
        });
    });

    describe('logoutIdam()', () => {
        it('should clear auth cookie and redirect to logout url when session is destroyed', (done) => {
            const idamSession = new IdamSession('', 'abc123');
            idamSession.config = {
                payloadVersion: '4',
                services: {
                    idam: {
                        endSessionUrl: 'https://idam.hmcts.net/logout'
                    }
                }
            };
            const logSpy = sinon.spy(idamSession, 'log');
            const redirectUri = 'https://probate.hmcts.net/sign-out?from=probate app';
            const req = {
                cookies: {a: 'b'},
                sessionID: 'session-1',
                sessionStore: {},
                session: {
                    destroy: sinon.stub().callsFake((callback) => callback())
                }
            };
            const res = {
                clearCookie: sinon.stub(),
                redirect: sinon.stub()
            };

            idamSession.logoutIdam(req, res, redirectUri);

            const expectedLogoutUrl =
                'https://idam.hmcts.net/logout/?post_logout_redirect_uri=' + encodeURI(redirectUri);
            expect(logSpy.calledTwice).to.equal(true);
            expect(logSpy.firstCall.calledWith('Logout and clear session')).to.equal(true);
            expect(logSpy.secondCall.calledWith('Logout url: ' + expectedLogoutUrl)).to.equal(true);
            expect(res.clearCookie.calledOnceWith('__auth-token-4')).to.equal(true);
            expect(res.redirect.calledOnceWith(303, expectedLogoutUrl)).to.equal(true);
            expect(req).to.not.have.property('cookies');
            expect(req).to.not.have.property('sessionID');
            expect(req).to.not.have.property('session');
            expect(req).to.not.have.property('sessionStore');

            logSpy.restore();
            done();
        });

        it('should reject and not clear cookie or redirect when session destroy fails', async () => {
            const idamSession = new IdamSession('', 'abc123');
            idamSession.config = {
                payloadVersion: '4',
                services: {
                    idam: {
                        endSessionUrl: 'https://idam.hmcts.net/logout'
                    }
                }
            };
            const logSpy = sinon.spy(idamSession, 'log');
            const error = new Error('destroy failed');
            const req = {
                session: {
                    destroy: sinon.stub().callsFake((callback) => callback(error))
                }
            };
            const res = {
                clearCookie: sinon.stub(),
                redirect: sinon.stub()
            };

            try {
                await idamSession.logoutIdam(req, res, 'https://probate.hmcts.nets/sign-out');
                throw new Error('Expected logoutIdam to reject');
            } catch (err) {
                expect(err).to.equal(error);
            }

            expect(logSpy.calledThrice).to.equal(true);
            expect(logSpy.thirdCall.calledWith(`Error destroying session: ${error}`)).to.equal(true);
            expect(res.clearCookie.called).to.equal(false);
            expect(res.redirect.called).to.equal(false);

            logSpy.restore();
        });
    });

    describe('delete()', () => {
        it('should call log() and fetchJson()', (done) => {
            const endpoint = '';
            const fetchOptions = {method: 'DELETE'};
            const accessToken = 'acc123';
            const idamSession = new IdamSession(endpoint, 'abc123');
            const logSpy = sinon.spy(idamSession, 'log');
            const fetchJsonSpy = sinon.stub(AsyncFetch, 'fetchJson');
            const fetchOptionsStub = sinon.stub(AsyncFetch, 'fetchOptions').returns(fetchOptions);

            idamSession.delete(accessToken);

            expect(idamSession.log.calledOnce).to.equal(true);
            expect(idamSession.log.calledWith('Delete idam session')).to.equal(true);
            expect(AsyncFetch.fetchJson.calledOnce).to.equal(true);
            expect(AsyncFetch.fetchJson.calledWith(`${endpoint}/session/${accessToken}`, fetchOptions)).to.equal(true);

            logSpy.restore();
            fetchJsonSpy.restore();
            fetchOptionsStub.restore();
            done();
        });
    });
});
