'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const rewire = require('rewire');
const PinSent = rewire('app/steps/ui/pin/sent');
const i18next = require('i18next');
const section = 'pin';
const templatePath = 'pin/sent';
const coreContextMockData = require('../../data/core-context-mock-data.json');
const schema = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    properties: {}
};

describe('Pin-Sent', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = PinSent.getUrl();
            expect(url).to.equal('/pin-sent*');
            done();
        });
    });

    describe('shouldPersistFormData()', () => {
        it('should return false', () => {
            const pinSent = new PinSent(steps, section, templatePath, i18next, schema);
            const persist = pinSent.shouldPersistFormData();
            expect(persist).to.equal(false);
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
                    phoneNumber: '0123456789'
                }
            };

            const pinResend = new PinSent(steps, section, templatePath, i18next, schema);
            const ctx = pinResend.getContextData(req);

            expect(ctx).to.deep.equal({
                ...coreContextMockData,
                sessionID: 'dummy_sessionId',
                phoneNumber: '0123456789'
            });

            done();
        });
    });
});
