'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
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
        let formdata;
        let session;
        let hostname;
        let featureToggles;

        it('should return the ctx with the deceased married status and the screening_question feature toggle', (done) => {
            ctx = {
                grossValueOnline: '500000',
                netValueOnline: '400000'
            };
            errors = {};
            [ctx, errors] = IhtValue.handlePost(ctx, errors, formdata, session, hostname, featureToggles);
            expect(ctx).to.deep.equal({
                grossValueOnline: '500000',
                grossValue: 500000,
                netValueOnline: '400000',
                netValue: 400000,
                isToggleEnabled: false
            });
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = IhtValue.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'isToggleEnabled',
                    value: true,
                    choice: 'toggleOn'
                }]
            });
            done();
        });
    });

    describe('action', () => {
        it('test isToggleEnabled is removed from the context', () => {
            const ctx = {
                isToggleEnabled: false
            };
            IhtValue.action(ctx);
            assert.isUndefined(ctx.isToggleEnabled);
        });
    });
});
