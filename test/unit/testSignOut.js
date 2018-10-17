'use strict';

const initSteps = require('app/core/initSteps');
const assert = require('chai').assert;
const sinon = require('sinon');
const when = require('when');
const services = require('app/components/services');

describe('Sign-Out', function () {
    const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
    const signOut = steps.SignOut;

    it('test authToken, cookies and session data have been removed from the session', (done) => {
        const signOutStub = sinon.stub(services, 'signOut');
        signOutStub.returns(when(200));

        const req = {
            cookies: {
                _ga: 'dummy_ga',
                _gid: 'dummy_gid',
                _gat: '1'
            },
            session: {
                form: {
                    payloadVersion: '4.1.0',
                    applicantEmail: 'test@email.com'
                },
                destroy: function () {
                    delete req.session;
                    delete req.sessionStore;
                }
            },
            sessionStore: {
                applicantID: 'test@email.com'
            },
        };

        signOut.getContextData(req).then(() => {
            assert.isUndefined(req.cookies);
            assert.isUndefined(req.sessionID);
            assert.isUndefined(req.session);
            assert.isUndefined(req.sessionStore);
            done();
        });
    });

    it('test correct url is returned from getUrl function', () => {
        assert.equal(signOut.constructor.getUrl(), '/sign-out');
    });
});
