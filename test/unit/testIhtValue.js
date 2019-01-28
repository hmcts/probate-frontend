'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const IhtValue = steps.IhtValue;

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
                grossValueOnline: '500000',
                netValueOnline: '400000'
            };
            errors = {};
            [ctx, errors] = IhtValue.handlePost(ctx, errors);
            expect(ctx).to.deep.equal({
                grossValueOnline: '500000',
                grossValue: 500000,
                netValueOnline: '400000',
                netValue: 400000
            });
            done();
        });
    });
});
