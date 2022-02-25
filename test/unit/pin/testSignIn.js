'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const config = require('config');
const nock = require('nock');
const rewire = require('rewire');
const PinPage = rewire('app/steps/ui/pin/signin');
const caseTypes = require('app/utils/CaseTypes');
const co = require('co');
const i18next = require('i18next');
const section = 'pin';
const templatePath = 'pin/signin';
const schema = {
    $schema: 'http://json-schema.org/draft-07/schema',
    properties: {}
};

describe('Pin-Page', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = PinPage.getUrl();
            expect(url).to.equal('/sign-in');
            done();
        });
    });

    describe('shouldPersistFormData()', () => {
        it('should return false', () => {
            const pinPage = new PinPage(steps, section, templatePath, i18next, schema);
            const persist = pinPage.shouldPersistFormData();
            expect(persist).to.equal(false);
        });
    });

    describe('handlePost()', () => {
        const ctxTestData = {
            caseType: caseTypes.GOP,
            pin: 123456
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
            formdataId: '1234567890123456',
            pin: 123456
        };
        const hostname = 'localhost';

        it('retireves the application data correctly', (done) => {
            const revertAuthorise = PinPage.__set__({
                Authorise: class {
                    post() {
                        return Promise.resolve({name: 'Success'});
                    }
                }
            });
            const revertSecurity = PinPage.__set__({
                Security: class {
                    getUserToken() {
                        return Promise.resolve('dummyToken');
                    }
                }
            });
            nock(config.services.orchestrator.url)
                .get('/forms/case/1234567890123456?probateType=PA')
                .reply(200, {
                    deceased: {
                        firstName: 'Dee',
                        lastName: 'Ceased'
                    },
                    declaration: {
                        declarationCheckbox: true
                    }
                });

            const pinResend = new PinPage(steps, section, templatePath, i18next, schema);

            co(function* () {
                const [ctx, errors] = yield pinResend.handlePost(ctxTestData, errorsTestData, formdata, session, hostname);
                expect(ctx).to.deep.equal(ctxTestData);
                expect(errors).to.deep.equal(errorsTestData);
                expect(session).to.deep.equal({
                    language: 'en',
                    formdataId: '1234567890123456',
                    pin: 123456,
                    form: {
                        deceased: {
                            firstName: 'Dee',
                            lastName: 'Ceased'
                        },
                        declaration: {}
                    }
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
