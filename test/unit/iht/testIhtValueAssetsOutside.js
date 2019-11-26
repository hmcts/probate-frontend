'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ValueAssetsOutside = steps.ValueAssetsOutside;
const content = require('app/resources/en/translation/iht/valueassetsoutside');

describe('ValueAssetsOutside', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ValueAssetsOutside.constructor.getUrl();
            expect(url).to.equal('/value-assets-outside-england-wales');
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;

        it('should return the ctx with the value of the assets outside england and wales', (done) => {
            ctx = {
                netValueAssetsOutsideField: '500000'
            };
            errors = [];
            [ctx, errors] = ValueAssetsOutside.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                netValueAssetsOutside: 500000,
                netValueAssetsOutsideField: '500000'
            });
            done();
        });

        it('should return the ctx with the value of the assets outside england and wales (value containing decimals)', (done) => {
            ctx = {
                netValueAssetsOutsideField: '500000.12'
            };
            errors = [];
            [ctx, errors] = ValueAssetsOutside.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                netValueAssetsOutside: 500000.12,
                netValueAssetsOutsideField: '500000.12'
            });
            done();
        });

        it('should return the ctx with the value of the assets outside england and wales (value containing 3 decimals and thousands separators)', (done) => {
            ctx = {
                netValueAssetsOutsideField: '500,000.345'
            };
            errors = [];
            [ctx, errors] = ValueAssetsOutside.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                netValueAssetsOutside: 500000.35,
                netValueAssetsOutsideField: '500,000.345'
            });
            done();
        });

        it('should return the errors correctly', (done) => {
            ctx = {
                netValueAssetsOutsideField: '50a0000'
            };
            errors = [];
            [ctx, errors] = ValueAssetsOutside.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                netValueAssetsOutside: 500000,
                netValueAssetsOutsideField: '50a0000'
            });
            expect(errors).to.deep.equal([
                {
                    field: 'netValueAssetsOutsideField',
                    href: '#netValueAssetsOutsideField',
                    msg: {
                        summary: content.errors.netValueAssetsOutsideField.invalidCurrencyFormat.summary,
                        message: content.errors.netValueAssetsOutsideField.invalidCurrencyFormat.message
                    }
                }
            ]);
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up formdata if netValue + netValueAssetsOutside <= £250k', () => {
            const ctx = {
                netValue: 150000,
                netValueAssetsOutside: 80000
            };
            const formdata = {
                deceased: {
                    anyChildren: 'optionYes',
                    allChildrenOver18: 'optionYes',
                    anyDeceasedChildren: 'optionYes',
                    anyGrandchildrenUnder18: 'optionNo'
                }
            };

            ValueAssetsOutside.action(ctx, formdata);

            assert.isUndefined(formdata.deceased.anyChildren);
            assert.isUndefined(formdata.deceased.allChildrenOver18);
            assert.isUndefined(formdata.deceased.anyDeceasedChildren);
            assert.isUndefined(formdata.deceased.anyGrandchildrenUnder18);
        });
    });
});
