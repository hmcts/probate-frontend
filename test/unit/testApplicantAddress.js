'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const ApplicantAddress = steps.ApplicantAddress;

describe('ApplicantAddress', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ApplicantAddress.constructor.getUrl();
            expect(url).to.equal('/applicant-address');
            done();
        });
    });

    describe('getContextData()', () => {
        let ctx;
        it('should return the ctx with the applicant addresses', (done) => {
            const req = {
                session: {
                    form: {},
                    addresses: {
                        applicant: [
                            {address: '1 Red Road, London, LL1 1LL'},
                            {address: '2 Green Road, London, LL2 2LL'}
                        ]
                    }
                }
            };

            ctx = ApplicantAddress.getContextData(req);
            expect(ctx.addresses).to.deep.equal = [
                {address: '1 Red Road, London, LL1 1LL'},
                {address: '2 Green Road, London, LL2 2LL'}
            ]
            ;
            done();
        });
    });

    describe('handlePost()', () => {
        const session ={};
        let ctx;
        const formdata ={};
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
            [ctx, errors] = ApplicantAddress.handlePost(ctx, errors, formdata, session);
            expect(session).to.deep.equal({
                addresses: {
                    applicant: [
                        {address: '1 Red Road, London, LL1 1LL'},
                        {address: '2 Green Road, London, LL2 2LL'}
                    ],
                }
            });
            done();
        });
    });
});
