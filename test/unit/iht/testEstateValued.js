'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const IhtEstateValued = steps.IhtEstateValued;

describe('EstateValued', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = IhtEstateValued.constructor.getUrl();
            expect(url).to.equal('/estate-valued');
            done();
        });
    });

    describe.only('handlePost()', () => {
        let ctx;
        let errors;
        it('should reset all values of subsequent iht pages if estate is valued', (done) => {
            ctx = {
                estateGrossValue: '500000',
                estateNetValue: '400000',
                estateNetQualifyingValue: '300000',
                estateValueCompleted: 'optionYes'

            };
            errors = [];
            [ctx, errors] = IhtEstateValued.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                estateGrossValueField: null,
                estateGrossValue: null,
                estateNetValueField: null,
                estateNetValue: null,
                estateNetQualifyingValue: null,
                deceasedHadLateSpouseOrCivilPartner: null,
                unusedAllowanceClaimed: null,
                estateValueCompleted: 'optionYes'
            });
            done();
        });
    });
});
