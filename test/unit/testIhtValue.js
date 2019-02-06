'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const IhtValue = steps.IhtValue;

describe('IhtValue', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = IhtValue.constructor.getUrl();
            expect(url).to.equal('/iht-value');
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;

        it('should return the ctx with the estate values', (done) => {
            ctx = {
                grossValueOnline: '500000',
                netValueOnline: '400000'
            };
            errors = [];
            [ctx, errors] = IhtValue.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                grossValueOnline: '500000',
                grossValue: 500000,
                netValueOnline: '400000',
                netValue: 400000
            });
            done();
        });

        it('should return the ctx with the estate values (values containing decimals)', (done) => {
            ctx = {
                grossValueOnline: '500000.00',
                netValueOnline: '400000.00'
            };
            errors = [];
            [ctx, errors] = IhtValue.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                grossValueOnline: '500000.00',
                grossValue: 500000,
                netValueOnline: '400000.00',
                netValue: 400000
            });
            done();
        });

        it('should return the errors correctly', (done) => {
            ctx = {
                grossValueOnline: '40a0000',
                netValueOnline: '50a0000'
            };
            errors = [];
            [ctx, errors] = IhtValue.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                grossValueOnline: '40a0000',
                grossValue: 400000,
                netValueOnline: '50a0000',
                netValue: 500000
            });
            expect(errors).to.deep.equal([
                {
                    msg: {
                        summary: 'You haven&rsquo;t entered a valid gross amount',
                        message: 'Enter a valid amount using numbers only'
                    },
                    param: 'grossValueOnline'
                },
                {
                    msg: {
                        summary: 'You haven&rsquo;t entered a valid net amount',
                        message: 'Enter a valid amount using numbers only'
                    },
                    param: 'netValueOnline'
                },
                {
                    msg: {
                        summary: 'The net amount can&rsquo;t be greater than the gross amount',
                        message: 'The net amount can&rsquo;t be greater than the gross amount'
                    },
                    param: 'netValueOnline'
                }
            ]);
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct next step options', (done) => {
            const ctx = {
                netValue: 200000
            };
            const result = IhtValue.nextStepOptions(ctx);
            expect(result).to.deep.equal({
                options: [{
                    key: 'lessThanOrEqualTo250k',
                    value: true,
                    choice: 'lessThanOrEqualTo250k'
                }]
            });
            done();
        });
    });

    describe('action', () => {
        it('test it cleans up context', () => {
            const ctx = {
                lessThanOrEqualTo250k: 200000
            };
            IhtValue.action(ctx);
            assert.isUndefined(ctx.lessThanOrEqualTo250k);
        });
    });
});
