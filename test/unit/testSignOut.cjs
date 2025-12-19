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

        section = 'applicant';
        templatePath = 'addressLookup';
        i18next = {};
        schema = {
            $schema: 'http://json-schema.org/draft-07/schema',
            properties: {}
        };

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
                destroy: () => {
                    delete req.session;
                    delete req.sessionStore;
                }
            },
            sessionStore: {
                applicantID: 'test@email.com'
            }
        };
        const res = {
            clearCookie: sinon.spy()
        };
        const signOut = new SignOut(steps, section, templatePath, i18next, schema);

        signOut.getContextData(req, res).then(() => {
            assert.isUndefined(req.cookies);
            assert.isUndefined(req.sessionID);
            assert.isUndefined(req.session);
            assert.isUndefined(req.sessionStore);
            revert();
            done();
        });
    });

    it('test correct url is returned from getUrl function', () => {
        assert.equal(SignOut.getUrl(), '/sign-out');
    });
});
