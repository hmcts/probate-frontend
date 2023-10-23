'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ProbateAssetValues = steps.ProbateAssetValues;
const content = require('app/resources/en/translation/iht/probateestatevalues');

describe('ProbateAssetValues', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ProbateAssetValues.constructor.getUrl();
            expect(url).to.equal('/probate-asset-values');
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;

        it('should return the ctx with the entered probate values', (done) => {
            ctx = {
                grossValueField: '500000',
                netValueField: '400000'
            };
            errors = [];
            [ctx, errors] = ProbateAssetValues.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                grossValueField: '500000',
                grossValue: 500000,
                netValueField: '400000',
                netValue: 400000
            });
            done();
        });

        it('should return the ctx with the probate values (values containing decimals)', (done) => {
            ctx = {
                grossValueField: '500000.12',
                netValueField: '400000.34'
            };
            errors = [];
            [ctx, errors] = ProbateAssetValues.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                grossValueField: '500000.12',
                grossValue: 500000.12,
                netValueField: '400000.34',
                netValue: 400000.34
            });
            done();
        });

        it('should return the probate values (values containing 3 decimals and thousands separators)', (done) => {
            ctx = {
                grossValueField: '500,000.123',
                netValueField: '400,000.345'

            };
            errors = [];
            [ctx, errors] = ProbateAssetValues.handlePost(ctx, errors, {}, {language: 'en'});
            expect(ctx).to.deep.equal({
                grossValueField: '500,000.123',
                grossValue: 500000.12,
                netValueField: '400,000.345',
                netValue: 400000.35
            });
            done();
        });

        it('should return the invalid currency and net > gross errors', (done) => {
            ctx = {
                grossValueField: '40a0000',
                netValueField: '50a0000'
            };
            errors = [];
            [ctx, errors] = ProbateAssetValues.handlePost(ctx, errors, {}, {language: 'en'});
            expect(ctx).to.deep.equal({
                grossValueField: '40a0000',
                grossValue: 400000,
                netValueField: '50a0000',
                netValue: 500000
            });
            expect(errors).to.deep.equal([{
                field: 'grossValueField',
                href: '#grossValueField',
                msg: content.errors.grossValueField.invalidCurrencyFormat
            },
            {
                field: 'netValueField',
                href: '#netValueField',
                msg: content.errors.netValueField.invalidCurrencyFormat
            },
            {
                field: 'netValueField',
                href: '#netValueField',
                msg: content.errors.netValueField.netValueGreaterThanGross
            }
            ]);
            done();
        });
    });
});
