'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const config = require('config');
const nock = require('nock');
const rewire = require('rewire');
const PinResend = rewire('app/steps/ui/pin/resend');
const caseTypes = require('app/utils/CaseTypes');
const co = require('co');
const i18next = require('i18next');
const section = 'pin';
const templatePath = 'pin/resend';
const schema = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    properties: {}
};
const coreContextMockData = require('../../data/core-context-mock-data.json');

describe('Pin-Resend', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = PinResend.getUrl();
            expect(url).to.equal('/pin-resend');
            done();
        });
    });

    describe('shouldPersistFormData()', () => {
        it('should return false', (done) => {
            const pinResend = new PinResend(steps, section, templatePath, i18next, schema);
            const persist = pinResend.shouldPersistFormData();
            expect(persist).to.equal(false);
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the ctx with lead exec name and phone number', (done) => {
            const req = {
                sessionID: 'dummy_sessionId',
                session: {
                    form: {
                        caseType: 'gop',
                        ccdCase: {
                            id: 1234567890123456,
                            state: 'Pending'
                        },
                        pin: {}
                    },
                    leadExecutorName: 'leadExecName',
                    phoneNumber: '0123456789'
                }
            };

            const pinResend = new PinResend(steps, section, templatePath, i18next, schema);
            const ctx = pinResend.getContextData(req);

            expect(ctx).to.deep.equal({
                ...coreContextMockData,
                sessionID: 'dummy_sessionId',
                leadExecutorName: 'leadExecName',
                phoneNumber: '0123456789'
            });

            done();
        });
    });

    describe('handlePost()', () => {
        const ctxTestData = {
            caseType: caseTypes.GOP
        };
        const errorsTestData = [];
        const formdata = {
            ccdCase: {
                id: 1535395401245028,
                state: 'PaAppCreated'
            }
        };
        const session = {
            language: 'en',
            phoneNumber: '07912345678'
        };
        const hostname = 'localhost';

        it('generates a PIN correctly', (done) => {
            const revertAuthorise = PinResend.__set__({
                Authorise: class {
                    post() {
                        return Promise.resolve({name: 'Success'});
                    }
                }
            });
            const revertSecurity = PinResend.__set__({
                Security: class {
                    getUserToken() {
                        return Promise.resolve('dummyToken');
                    }
                }
            });
            nock(config.services.orchestrator.url)
                .get('/invite/pin?phoneNumber=07912345678')
                .reply(200, '123456');

            const pinResend = new PinResend(steps, section, templatePath, i18next, schema);

            co(function* () {
                const [ctx, errors] = yield pinResend.handlePost(ctxTestData, errorsTestData, formdata, session, hostname);
                expect(ctx).to.deep.equal(ctxTestData);
                expect(errors).to.deep.equal(errorsTestData);
                expect(session).to.deep.equal({
                    language: 'en',
                    phoneNumber: '07912345678',
                    pin: 123456
                });

                revertAuthorise();
                revertSecurity();
                nock.cleanAll();
                done();
            }).catch((err) => {
                revertAuthorise();
                revertSecurity();
                nock.cleanAll();
                done(err);
            });
        });
    });
});
