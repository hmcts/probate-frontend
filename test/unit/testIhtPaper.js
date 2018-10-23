'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const IhtPaper = steps.IhtPaper;

describe('IhtPaper', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = IhtPaper.constructor.getUrl();
            expect(url).to.equal('/iht-paper');
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
                form: 'IHT205',
                grossIHT205: '500000',
                netIHT205: '400000'
            };
            errors = {};
            [ctx, errors] = IhtPaper.handlePost(ctx, errors, formdata, session, hostname, featureToggles);
            expect(ctx).to.deep.equal({
                form: 'IHT205',
                grossIHT205: '500000',
                grossValue: 500000,
                grossValuePaper: '500000',
                ihtFormId: 'IHT205',
                netIHT205: '400000',
                netValue: 400000,
                netValuePaper: '400000',
                isToggleEnabled: false
            });
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = IhtPaper.nextStepOptions();
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
                grossValuePaper: 500000,
                netValuePaper: 400000,
                isToggleEnabled: false
            };
            IhtPaper.action(ctx);
            assert.isUndefined(ctx.grossValuePaper);
            assert.isUndefined(ctx.netValuePaper);
            assert.isUndefined(ctx.isToggleEnabled);
        });
    });
});
