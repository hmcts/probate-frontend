'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const IhtValue = steps.IhtValue;
const content = require('app/resources/en/translation/iht/value');

describe('IhtValue', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = IhtValue.constructor.getUrl();
            expect(url).to.equal('/iht-value*');
            done();
        });
    });

    describe('getContextData()', () => {
        let ctx;
        let req;

        it('should return the context with the IHT threshold', (done) => {
            req = {
                session: {
                    form: {
                        deceased: {
                            'dod-date': '2016-10-12'
                        }
                    }
                }
            };

            ctx = IhtValue.getContextData(req);
            expect(ctx.ihtThreshold).to.equal(250000);
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
            [ctx, errors] = IhtValue.handlePost(ctx, errors, {}, {language: 'en'});
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
            [ctx, errors] = IhtValue.handlePost(ctx, errors, {}, {language: 'en'});
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

    describe('nextStepOptions()', () => {
        it('should return the correct next step options', (done) => {
            const ctx = {
                netValue: 200000
            };
            const result = IhtValue.nextStepOptions(ctx);
            expect(result).to.deep.equal({
                options: [{
                    key: 'lessThanOrEqualToIhtThreshold',
                    value: true,
                    choice: 'lessThanOrEqualToIhtThreshold'
                }]
            });
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context when netValue is more than the IHT threshold', () => {
            const ctx = {
                ihtThreshold: 250000,
                netValue: 400000,
                lessThanOrEqualToIhtThreshold: false,
                assetsOutside: 'optionYes',
                netValueAssetsOutsideField: '600000',
                netValueAssetsOutside: 600000
            };
            const formdata = {};

            IhtValue.action(ctx, formdata);

            expect(ctx).to.deep.equal({
                netValue: 400000
            });
        });

        it('test it cleans up context and formdata when netValue is less than or equal to the IHT threshold', () => {
            const ctx = {
                ihtThreshold: 250000,
                netValue: 200000,
                lessThanOrEqualToIhtThreshold: true
            };
            const formdata = {
                deceased: {
                    anyChildren: 'optionYes',
                    allChildrenOver18: 'optionYes',
                    anyDeceasedChildren: 'optionYes',
                    anyGrandchildrenUnder18: 'optionNo'
                }
            };

            IhtValue.action(ctx, formdata);

            expect(ctx).to.deep.equal({
                netValue: 200000
            });
            assert.isUndefined(formdata.deceased.anyChildren);
            assert.isUndefined(formdata.deceased.allChildrenOver18);
            assert.isUndefined(formdata.deceased.anyDeceasedChildren);
            assert.isUndefined(formdata.deceased.anyGrandchildrenUnder18);
        });
    });
});
