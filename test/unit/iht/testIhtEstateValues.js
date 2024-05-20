const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const content = require('app/resources/en/translation/iht/ihtestatevalues');
const IhtEstateValues = steps.IhtEstateValues;
/* eslint max-lines: off */

describe('IhtEstateValues', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = IhtEstateValues.constructor.getUrl();
            expect(url).to.equal('/iht-estate-values');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options qualifying value within range', (done) => {
            const ctx = {estateNetQualifyingValue: 500000};
            const nextStepOptions = IhtEstateValues.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'netQualifyingValueWithinRange', value: true, choice: 'netQualifyingValueWithinRange'},
                ]
            });
            done();
        });

        it('should return the correct options qualifying value out of range', (done) => {
            const ctx = {estateNetQualifyingValue: 100000};
            const nextStepOptions = IhtEstateValues.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'netQualifyingValueWithinRange', value: true, choice: 'netQualifyingValueWithinRange'},
                ]
            });
            done();
        });

        it('should return the correct options qualifying value undefined', (done) => {
            const ctx = {};
            const nextStepOptions = IhtEstateValues.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'netQualifyingValueWithinRange', value: true, choice: 'netQualifyingValueWithinRange'},
                ]
            });
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
            [ctx, errors] = IhtEstateValues.handlePost(ctx, errors, {}, {language: 'en'});
            expect(ctx).to.deep.equal({
                estateGrossValueField: '500000',
                estateGrossValue: 500000,
                estateNetValueField: '400000',
                estateNetValue: 400000,
                estateNetQualifyingValueField: '200000',
                estateNetQualifyingValue: 200000
            });
            expect(errors.length).equal(0);
            done();
        });

        it('should error the ctx with the estate values (values containing decimals)', (done) => {
            ctx = {
                estateGrossValueField: '500000.12',
                estateNetValueField: '400000.34',
                estateNetQualifyingValueField: '200000.58'
            };
            errors = [];
            [ctx, errors] = IhtEstateValues.handlePost(ctx, errors, {}, {language: 'en'});
            expect(ctx).to.deep.equal({
                estateGrossValueField: '500000.12',
                estateGrossValue: 500000.12,
                estateNetValueField: '400000.34',
                estateNetValue: 400000.34,
                estateNetQualifyingValueField: '200000.58',
                estateNetQualifyingValue: 200000.58
            });
            expect(errors).to.deep.equal([
                {
                    field: 'estateGrossValueField',
                    href: '#estateGrossValueField',
                    msg: content.errors.estateGrossValueField.invalidInteger
                },
                {
                    field: 'estateNetValueField',
                    href: '#estateNetValueField',
                    msg: content.errors.estateNetValueField.invalidInteger
                },
                {
                    field: 'estateNetQualifyingValueField',
                    href: '#estateNetQualifyingValueField',
                    msg: content.errors.estateNetQualifyingValueField.invalidInteger
                }
            ]);
            done();
        });

        it('should error the ctx with the estate values (thousands separators)', (done) => {
            ctx = {
                estateGrossValueField: '500,000',
                estateNetValueField: '400,000',
                estateNetQualifyingValueField: '200,000'
            };
            errors = [];
            [ctx, errors] = IhtEstateValues.handlePost(ctx, errors, {}, {language: 'en'});
            expect(ctx).to.deep.equal({
                estateGrossValueField: '500,000',
                estateGrossValue: 500000,
                estateNetValueField: '400,000',
                estateNetValue: 400000,
                estateNetQualifyingValueField: '200,000',
                estateNetQualifyingValue: 200000
            });
            expect(errors).to.deep.equal([
                {
                    field: 'estateGrossValueField',
                    href: '#estateGrossValueField',
                    msg: content.errors.estateGrossValueField.invalidInteger
                },
                {
                    field: 'estateNetValueField',
                    href: '#estateNetValueField',
                    msg: content.errors.estateNetValueField.invalidInteger
                },
                {
                    field: 'estateNetQualifyingValueField',
                    href: '#estateNetQualifyingValueField',
                    msg: content.errors.estateNetQualifyingValueField.invalidInteger
                }
            ]);
            done();
        });

        it('should error the ctx with the estate values (values containing 3 decimals and thousands separators)', (done) => {
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
                estateNetValue: 400000
            });
            done();
        });

        it('should reset net qualifying value if net qualifying field value is empty and net qualifying value exists', (done) => {
            ctx = {
                estateGrossValueField: '500000',
                estateNetValueField: '400000',
                estateNetQualifyingValue: 200000
            };
            errors = [];
            [ctx, errors] = IhtEstateValues.handlePost(ctx, errors, {}, {language: 'en'});
            expect(ctx).to.deep.equal({
                estateGrossValueField: '500000',
                estateGrossValue: 500000,
                estateNetValueField: '400000',
                estateNetValue: 400000,
                estateNetQualifyingValueField: '',
                estateNetQualifyingValue: 0.0
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
                    msg: content.errors.estateGrossValueField.invalidInteger
                },
                {
                    field: 'estateNetValueField',
                    href: '#estateNetValueField',
                    msg: content.errors.estateNetValueField.invalidInteger
                },
                {
                    field: 'estateNetQualifyingValueField',
                    href: '#estateNetQualifyingValueField',
                    msg: content.errors.estateNetQualifyingValueField.invalidInteger
                },
                {
                    field: 'estateNetValueField',
                    href: '#estateNetValueField',
                    msg: content.errors.estateNetValueField.netValueGreaterThanGross
                }
            ]);
            done();
        });
        it('should return the errors when netQualifying value ', (done) => {
            ctx = {
                estateGrossValueField: '5000',
                estateNetValueField: '60000',
                estateNetQualifyingValueField: '10000'
            };
            errors = [];
            [ctx, errors] = IhtEstateValues.handlePost(ctx, errors, {}, {language: 'en'});
            expect(ctx).to.deep.equal({
                estateGrossValueField: '5000',
                estateGrossValue: 5000,
                estateNetValueField: '60000',
                estateNetValue: 60000,
                estateNetQualifyingValueField: '10000',
                estateNetQualifyingValue: 10000
            });
            expect(errors).to.deep.equal([
                {
                    field: 'estateNetQualifyingValueField',
                    href: '#estateNetQualifyingValueField',
                    msg: content.errors.estateNetQualifyingValueField.netQualifyingValueGrater
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
    describe('isComplete()', () => {
        it('should return the complete when have estateValueCompleted', (done) => {
            const ctx = {
                estateValueCompleted: 'optionNo',
                estateGrossValueField: '500000',
                estateNetValueField: '400000',
                estateNetQualifyingValueField: '200000',
                ihtFormId: 'ihtFormId'
            };
            const result = IhtEstateValues.isComplete(ctx);
            const expectedTrue = [true, 'inProgress'];
            expect(result).to.deep.equal(expectedTrue);
            done();
        });
        it('should return complete when no estateValueCompleted', (done) => {
            const ctx = {
            };
            const result = IhtEstateValues.isComplete(ctx);
            const expectedTrue = [true, 'inProgress'];
            expect(result).to.deep.equal(expectedTrue);
            done();
        });
        it('should return false when estate value incompleted, no gross,net,nor nqv values', (done) => {
            const ctx = {
                estateValueCompleted: 'optionNo'
            };
            const result = IhtEstateValues.isComplete(ctx);
            const expectedFalse = [false, 'inProgress'];
            expect(result).to.deep.equal(expectedFalse);
            done();
        });
    });
});
