'use strict';

const initSteps = require('app/core/initSteps');
const assert = require('chai').assert;

describe('Timeout', function () {
    const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
    const timeout = steps.Timeout;

    it('test authToken, cookies and session data have been removed from the session', (done) => {
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

        timeout.getContextData(req);
        assert.isUndefined(req.cookies);
        assert.isUndefined(req.sessionID);
        assert.isUndefined(req.session);
        assert.isUndefined(req.sessionStore);
        done();
    });

    it('test correct url is returned from getUrl function', () => {
        assert.equal(timeout.constructor.getUrl(), '/time-out');
    });
});
