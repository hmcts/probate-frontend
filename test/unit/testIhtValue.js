'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const contentAssetsOutside = require('app/resources/en/translation/iht/assetsoutside');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const IhtValue = steps.IhtValue;
const content = require('app/resources/en/translation/iht/value');
const he = require('he');

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
                grossValueField: '500000',
                netValueField: '400000'
            };
            errors = [];
            [ctx, errors] = IhtValue.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                grossValueField: '500000',
                grossValue: 500000,
                netValueField: '400000',
                netValue: 400000
            });
            done();
        });

        it('should return the ctx with the estate values (values containing decimals)', (done) => {
            ctx = {
                grossValueField: '500000.12',
                netValueField: '400000.34'
            };
            errors = [];
            [ctx, errors] = IhtValue.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                grossValueField: '500000.12',
                grossValue: 500000.12,
                netValueField: '400000.34',
                netValue: 400000.34
            });
            done();
        });

        it('should return the ctx with the estate values (values containing 3 decimals and thousands separators)', (done) => {
            ctx = {
                grossValueField: '500,000.123',
                netValueField: '400,000.345'
            };
            errors = [];
            [ctx, errors] = IhtValue.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                grossValueField: '500,000.123',
                grossValue: 500000.12,
                netValueField: '400,000.345',
                netValue: 400000.35
            });
            done();
        });

        it('should return the errors correctly', (done) => {
            ctx = {
                grossValueField: '40a0000',
                netValueField: '50a0000'
            };
            errors = [];
            [ctx, errors] = IhtValue.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                grossValueField: '40a0000',
                grossValue: 400000,
                netValueField: '50a0000',
                netValue: 500000
            });
            expect(errors).to.deep.equal([
                {
                    field: 'grossValueField',
                    href: '#grossValueField',
                    text: he.decode(content.errors.grossValueField.invalidCurrencyFormat.message)
                },
                {
                    field: 'netValueField',
                    href: '#netValueField',
                    text: he.decode(content.errors.netValueField.invalidCurrencyFormat.message)
                },
                {
                    field: 'netValueField',
                    href: '#netValueField',
                    text: he.decode(content.errors.netValueField.netValueGreaterThanGross.message)
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

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                netValue: 400000,
                lessThanOrEqualTo250k: false,
                assetsOutside: contentAssetsOutside.optionYes,
                netValueAssetsOutsideField: '600000',
                netValueAssetsOutside: 600000
            };
            IhtValue.action(ctx);
            expect(ctx).to.deep.equal({
                netValue: 400000
            });
        });
    });
});
