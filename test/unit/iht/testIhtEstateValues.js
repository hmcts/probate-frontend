const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const content = require('app/resources/en/translation/iht/ihtestatevalues');
const IhtEstateValues = steps.IhtEstateValues;

describe('IhtEstateValues', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = IhtEstateValues.constructor.getUrl();
            expect(url).to.equal('/iht-estate-values');
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;

        it('should return the ctx with the estate values', (done) => {
            ctx = {
                estateGrossValueField: '500000',
                estateNetValueField: '400000',
                estateNetQualifyingValueField: '200000'
            };
            errors = [];
            [ctx, errors] = IhtEstateValues.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                estateGrossValueField: '500000',
                estateGrossValue: 500000,
                estateNetValueField: '400000',
                estateNetValue: 400000,
                estateNetQualifyingValueField: '200000',
                estateNetQualifyingValue: 200000
            });
            done();
        });

        it('should return the ctx with the estate values (values containing decimals)', (done) => {
            ctx = {
                estateGrossValueField: '500000.12',
                estateNetValueField: '400000.34',
                estateNetQualifyingValueField: '200000.58'
            };
            errors = [];
            [ctx, errors] = IhtEstateValues.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                estateGrossValueField: '500000.12',
                estateGrossValue: 500000.12,
                estateNetValueField: '400000.34',
                estateNetValue: 400000.34,
                estateNetQualifyingValueField: '200000.58',
                estateNetQualifyingValue: 200000.58
            });
            done();
        });

        it('should return the ctx with the estate values (values containing 3 decimals and thousands separators)', (done) => {
            ctx = {
                estateGrossValueField: '500,000.123',
                estateNetValueField: '400,000.345',
                estateNetQualifyingValueField: '200,000.586'

            };
            errors = [];
            [ctx, errors] = IhtEstateValues.handlePost(ctx, errors, {}, {language: 'en'});
            expect(ctx).to.deep.equal({
                estateGrossValueField: '500,000.123',
                estateGrossValue: 500000.12,
                estateNetValueField: '400,000.345',
                estateNetValue: 400000.35,
                estateNetQualifyingValueField: '200,000.586',
                estateNetQualifyingValue: 200000.59
            });
            done();
        });

        it('should return the ctx with the estate values and no input for net qualifying value', (done) => {
            ctx = {
                estateGrossValueField: '500000',
                estateNetValueField: '400000',
            };
            errors = [];
            [ctx, errors] = IhtEstateValues.handlePost(ctx, errors, {}, {language: 'en'});
            expect(ctx).to.deep.equal({
                estateGrossValueField: '500000',
                estateGrossValue: 500000,
                estateNetValueField: '400000',
                estateNetValue: 400000,
                estateNetQualifyingValueField: '0.00',
                estateNetQualifyingValue: 0
            });
            done();
        });

        it('should return the errors correctly', (done) => {
            ctx = {
                estateGrossValueField: '40a0000',
                estateNetValueField: '50a0000',
                estateNetQualifyingValueField: '20a0000'
            };
            errors = [];
            [ctx, errors] = IhtEstateValues.handlePost(ctx, errors, {}, {language: 'en'});
            expect(ctx).to.deep.equal({
                estateGrossValueField: '40a0000',
                estateGrossValue: 400000,
                estateNetValueField: '50a0000',
                estateNetValue: 500000,
                estateNetQualifyingValueField: '20a0000',
                estateNetQualifyingValue: 200000
            });
            expect(errors).to.deep.equal([
                {
                    field: 'estateGrossValueField',
                    href: '#estateGrossValueField',
                    msg: content.errors.estateGrossValueField.invalidCurrencyFormat
                },
                {
                    field: 'estateNetValueField',
                    href: '#estateNetValueField',
                    msg: content.errors.estateNetValueField.invalidCurrencyFormat
                },
                {
                    field: 'estateNetQualifyingValueField',
                    href: '#estateNetQualifyingValueField',
                    msg: content.errors.estateNetQualifyingValueField.invalidCurrencyFormat
                },
                {
                    field: 'estateNetValueField',
                    href: '#estateNetValueField',
                    msg: content.errors.estateNetValueField.netValueGreaterThanGross
                }
            ]);
            done();
        });

    });
});
