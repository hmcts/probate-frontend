'use strict';

const initSteps = require('app/core/initSteps.cjs');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ProbateEstateValues = steps.ProbateEstateValues;
const content = require('app/resources/en/translation/iht/probateestatevalues');

describe('ProbateEstateValues', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ProbateEstateValues.constructor.getUrl();
            expect(url).to.equal('/probate-estate-values');
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
            [ctx, errors] = ProbateEstateValues.handlePost(ctx, errors);
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
            [ctx, errors] = ProbateEstateValues.handlePost(ctx, errors, {}, {language: 'en'});
            expect(ctx).to.deep.equal({
                grossValueField: '500000.12',
                grossValue: 500000.12,
                netValueField: '400000.34',
                netValue: 400000.34
            });
            expect(errors).to.deep.equal([
                {
                    field: 'grossValueField',
                    href: '#grossValueField',
                    msg: content.errors.grossValueField.invalidInteger
                },
                {
                    field: 'netValueField',
                    href: '#netValueField',
                    msg: content.errors.netValueField.invalidInteger
                }
            ]);
            done();
        });

        it('should error the ctx with the estate values (thousands separators)', (done) => {
            ctx = {
                grossValueField: '500,000',
                netValueField: '400,000'
            };
            errors = [];
            [ctx, errors] = ProbateEstateValues.handlePost(ctx, errors, {}, {language: 'en'});
            expect(ctx).to.deep.equal({
                grossValueField: '500,000',
                grossValue: 500000,
                netValueField: '400,000',
                netValue: 400000,
            });
            expect(errors).to.deep.equal([
                {
                    field: 'grossValueField',
                    href: '#grossValueField',
                    msg: content.errors.grossValueField.invalidInteger
                },
                {
                    field: 'netValueField',
                    href: '#netValueField',
                    msg: content.errors.netValueField.invalidInteger
                }
            ]);
            done();
        });

        it('should return the probate values (values containing 3 decimals and thousands separators)', (done) => {
            ctx = {
                grossValueField: '500,000.123',
                netValueField: '400,000.345'

            };
            errors = [];
            [ctx, errors] = ProbateEstateValues.handlePost(ctx, errors, {}, {language: 'en'});
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
            [ctx, errors] = ProbateEstateValues.handlePost(ctx, errors, {}, {language: 'en'});
            expect(ctx).to.deep.equal({
                grossValueField: '40a0000',
                grossValue: 400000,
                netValueField: '50a0000',
                netValue: 500000
            });
            expect(errors).to.deep.equal([{
                field: 'grossValueField',
                href: '#grossValueField',
                msg: content.errors.grossValueField.invalidInteger
            },
            {
                field: 'netValueField',
                href: '#netValueField',
                msg: content.errors.netValueField.invalidInteger
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

    describe('isComplete()', () => {
        it('should return the complete when have gross and net value', (done) => {
            const ctx = {
                grossValue: 5000,
                netValue: 5000
            };
            const result = ProbateEstateValues.isComplete(ctx);
            const expectedTrue = [true, 'inProgress'];
            expect(result).to.deep.equal(expectedTrue);
            done();
        });
        it('should return complete false when no gross and net value', (done) => {
            const ctx = {
            };
            const result = ProbateEstateValues.isComplete(ctx);
            const expectedFalse = [false, 'inProgress'];
            expect(result).to.deep.equal(expectedFalse);
            done();
        });
        it('should return complete false when empty gross and net value', (done) => {
            const ctx = {
                grossValue: null,
                netValue: null
            };
            const result = ProbateEstateValues.isComplete(ctx);
            const expectedFalse = [false, 'inProgress'];
            expect(result).to.deep.equal(expectedFalse);
            done();
        });
    });
});
