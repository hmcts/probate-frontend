'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const IhtPaper = steps.IhtPaper;

describe('IhtPaper', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = IhtPaper.constructor.getUrl();
            expect(url).to.equal('/iht-paper');
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;

        it('should return the ctx with the estate values', (done) => {
            ctx = {
                form: 'IHT205',
                grossIHT205: '500000',
                netIHT205: '400000'
            };
            errors = [];
            [ctx, errors] = IhtPaper.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                form: 'IHT205',
                ihtFormId: 'IHT205',
                grossIHT205: '500000',
                grossValuePaper: '500000',
                grossValue: 500000,
                netIHT205: '400000',
                netValuePaper: '400000',
                netValue: 400000
            });
            done();
        });

        it('should return the ctx with the estate values (values containing decimals)', (done) => {
            ctx = {
                form: 'IHT205',
                grossIHT205: '500000.00',
                netIHT205: '400000.00'
            };
            errors = [];
            [ctx, errors] = IhtPaper.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                form: 'IHT205',
                ihtFormId: 'IHT205',
                grossIHT205: '500000.00',
                grossValuePaper: '500000.00',
                grossValue: 500000,
                netIHT205: '400000.00',
                netValuePaper: '400000.00',
                netValue: 400000
            });
            done();
        });

        it('should return the errors correctly', (done) => {
            ctx = {
                form: 'IHT205',
                grossIHT205: '40a0000',
                netIHT205: '50a0000'
            };
            errors = [];
            [ctx, errors] = IhtPaper.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                form: 'IHT205',
                ihtFormId: 'IHT205',
                grossIHT205: '40a0000',
                grossValuePaper: '40a0000',
                grossValue: 400000,
                netIHT205: '50a0000',
                netValuePaper: '50a0000',
                netValue: 500000
            });
            expect(errors).to.deep.equal([
                {
                    msg: {
                        summary: 'You haven&rsquo;t entered a valid gross amount',
                        message: 'Enter a valid amount using numbers only'
                    },
                    param: 'grossIHT205'
                },
                {
                    msg: {
                        summary: 'You haven&rsquo;t entered a valid net amount',
                        message: 'Enter a valid amount using numbers only'
                    },
                    param: 'netIHT205'
                },
                {
                    msg: {
                        summary: 'The net amount can&rsquo;t be greater than the gross amount',
                        message: 'The net amount can&rsquo;t be greater than the gross amount'
                    },
                    param: 'netIHT205'
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
            const result = IhtPaper.nextStepOptions(ctx);
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
                grossValuePaper: 500000,
                netValuePaper: 400000,
                lessThanOrEqualTo250k: 200000
            };
            IhtPaper.action(ctx);
            assert.isUndefined(ctx.grossValuePaper);
            assert.isUndefined(ctx.netValuePaper);
            assert.isUndefined(ctx.lessThanOrEqualTo250k);
        });
    });
});
