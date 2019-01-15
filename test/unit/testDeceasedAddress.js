'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const DeceasedAddress = steps.DeceasedAddress;

describe('DeceasedAddress', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedAddress.constructor.getUrl();
            expect(url).to.equal('/deceased-address');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the ctx with the deceased address and the document_upload feature toggle on', (done) => {
            const req = {
                sessionID: 'dummy_sessionId',
                session: {
                    form: {
                        journeyType: 'probate'
                    },
                    featureToggles: {
                        document_upload: true
                    },
                    journeyType: 'probate'
                },
                body: {
                    freeTextAddress: '143 Caerfai Bay Road',
                    postcode: 'L23 6WW'
                }
            };
            const ctx = DeceasedAddress.getContextData(req);
            expect(ctx).to.deep.equal({
                freeTextAddress: '143 Caerfai Bay Road',
                postcode: 'L23 6WW',
                isDocumentUploadToggleEnabled: true,
                sessionID: 'dummy_sessionId',
                journeyType: 'probate'
            });
            done();
        });

        it('should return the ctx with the deceased address and the document_upload feature toggle off', (done) => {
            const req = {
                sessionID: 'dummy_sessionId',
                session: {
                    form: {
                        journeyType: 'probate'
                    },
                    featureToggles: {
                        document_upload: false
                    },
                    journeyType: 'probate'
                },
                body: {
                    freeTextAddress: '143 Caerfai Bay Road',
                    postcode: 'L23 6WW'
                }
            };
            const ctx = DeceasedAddress.getContextData(req);
            expect(ctx).to.deep.equal({
                freeTextAddress: '143 Caerfai Bay Road',
                postcode: 'L23 6WW',
                isDocumentUploadToggleEnabled: false,
                sessionID: 'dummy_sessionId',
                journeyType: 'probate'
            });
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = DeceasedAddress.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'isDocumentUploadToggleEnabled', value: true, choice: 'documentUploadToggleOn'}
                ]
            });
            done();
        });
    });

    describe('action', () => {
        it('test variables are removed from the context', () => {
            const ctx = {
                isDocumentUploadToggleEnabled: false
            };
            DeceasedAddress.action(ctx);
            assert.isUndefined(ctx.isDocumentUploadToggleEnabled);
        });
    });
});
