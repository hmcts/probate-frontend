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

        it('should save ctx addresses to the session when there are addresses', (done) => {
            ctx = {
                addresses: [
                    {address: '1 Red Road, London, LL1 1LL'},
                    {address: '2 Green Road, London, LL2 2LL'}
                ],
                postcodeAddress: 'the postcode address',
                postcode: 'the postcode',
                address: '1 Red Road, London, LL1 1LL',
                referrer: ''
            };
            let errors = {};
            [ctx, errors] = DeceasedAddress.handlePost(ctx, errors, formdata, session);
            expect(session).to.deep.equal({
                addresses: {
                    deceased: [
                        {address: '1 Red Road, London, LL1 1LL'},
                        {address: '2 Green Road, London, LL2 2LL'}
                    ],
                }
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
