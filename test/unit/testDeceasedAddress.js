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
        let ctx;
        it('should return the ctx with the deceased addresses', (done) => {
            const req = {
                session: {
                    form: {},
                    addresses: {
                        deceased: [
                            {address: '1 Red Road, London, LL1 1LL'},
                            {address: '2 Green Road, London, LL2 2LL'}
                        ]
                    }
                }
            };

            ctx = DeceasedAddress.getContextData(req);
            expect(ctx.addresses).to.deep.equal = [
                    {address: '1 Red Road, London, LL1 1LL'},
                    {address: '2 Green Road, London, LL2 2LL'}
                ]
            ;
            done();
        });
    });
    describe.only('handlePost()', () => {
        let ctx;
        let errors;
        const formdata = {};
        const session = {};
        let hostname;
        let featureToggles;

        it('should return the ctx with the deceased address and the screening_question feature toggle', (done) => {
            ctx = {
                freeTextAddress: '143 Caerfai Bay Road',
                postcode: 'L23 6WW'
            };
            errors = {};
            [ctx, errors] = DeceasedAddress.handlePost(ctx, errors, formdata, session, hostname, featureToggles);
            expect(ctx).to.deep.equal({
                freeTextAddress: '143 Caerfai Bay Road',
                address: '143 Caerfai Bay Road',
                postcode: 'L23 6WW',
                isToggleEnabled: false
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
                options: [{
                    key: 'isToggleEnabled',
                    value: true,
                    choice: 'toggleOn'
                }]
            });
            done();
        });
    });

    describe('action', () => {
        it('test isToggleEnabled is removed from the context', () => {
            const ctx = {
                isToggleEnabled: false
            };
            DeceasedAddress.action(ctx);
            assert.isUndefined(ctx.isToggleEnabled);
        });
    });
});
