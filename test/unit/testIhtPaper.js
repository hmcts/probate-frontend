'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const contentAssetsOutside = require('app/resources/en/translation/iht/assetsoutside');
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
                grossValueFieldIHT205: '500000',
                netValueFieldIHT205: '400000'
            };
            errors = [];
            [ctx, errors] = IhtPaper.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                form: 'IHT205',
                ihtFormId: 'IHT205',
                grossValueFieldIHT205: '500000',
                grossValuePaper: '500000',
                grossValue: 500000,
                netValueFieldIHT205: '400000',
                netValuePaper: '400000',
                netValue: 400000
            });
            done();
        });

        it('should return the ctx with the estate values (values containing decimals)', (done) => {
            ctx = {
                form: 'IHT205',
                grossValueFieldIHT205: '500000.12',
                netValueFieldIHT205: '400000.34'
            };
            errors = [];
            [ctx, errors] = IhtPaper.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                form: 'IHT205',
                ihtFormId: 'IHT205',
                grossValueFieldIHT205: '500000.12',
                grossValuePaper: '500000.12',
                grossValue: 500000.12,
                netValueFieldIHT205: '400000.34',
                netValuePaper: '400000.34',
                netValue: 400000.34
            });
            done();
        });

        it('should return the ctx with the estate values (values containing 3 decimals and thousands separators)', (done) => {
            ctx = {
                form: 'IHT205',
                grossValueFieldIHT205: '500,000.123',
                netValueFieldIHT205: '400,000.345'
            };
            errors = [];
            [ctx, errors] = IhtPaper.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                form: 'IHT205',
                ihtFormId: 'IHT205',
                grossValueFieldIHT205: '500,000.123',
                grossValuePaper: '500,000.123',
                grossValue: 500000.12,
                netValueFieldIHT205: '400,000.345',
                netValuePaper: '400,000.345',
                netValue: 400000.35
            });
            done();
        });

        it('should return the errors correctly', (done) => {
            ctx = {
                form: 'IHT205',
                grossValueFieldIHT205: '40a0000',
                netValueFieldIHT205: '50a0000'
            };
            errors = [];
            [ctx, errors] = IhtPaper.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                form: 'IHT205',
                ihtFormId: 'IHT205',
                grossValueFieldIHT205: '40a0000',
                grossValuePaper: '40a0000',
                grossValue: 400000,
                netValueFieldIHT205: '50a0000',
                netValuePaper: '50a0000',
                netValue: 500000
            });
            expect(errors).to.deep.equal([
                {
                    msg: {
                        summary: 'Gross value can only contain numbers',
                        message: 'Gross value must be a whole number or a number with 2 decimal places'
                    },
                    param: 'grossValueFieldIHT205'
                },
                {
                    msg: {
                        summary: 'Net value can only contain numbers',
                        message: 'Net value must be a whole number or a number with 2 decimal places'
                    },
                    param: 'netValueFieldIHT205'
                },
                {
                    msg: {
                        summary: 'The net amount can&rsquo;t be greater than the gross amount',
                        message: 'The net amount can&rsquo;t be greater than the gross amount'
                    },
                    param: 'netValueFieldIHT205'
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

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                netValue: 400000,
                lessThanOrEqualTo250k: false,
                grossValuePaper: 500000,
                netValuePaper: 400000,
                assetsOutside: contentAssetsOutside.optionYes,
                netValueAssetsOutsideField: '600000',
                netValueAssetsOutside: 600000
            };
            IhtPaper.action(ctx);
            expect(ctx).to.deep.equal({
                netValue: 400000
            });
        });
    });
});
