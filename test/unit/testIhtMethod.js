'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const content = require('app/resources/en/translation/iht/method');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const IhtMethod = steps.IhtMethod;

describe('IhtMethod', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = IhtMethod.constructor.getUrl();
            expect(url).to.equal('/iht-method');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct next step options', (done) => {
            const result = IhtMethod.nextStepOptions();
            expect(result).to.deep.equal({
                options: [{
                    key: 'method',
                    value: content.optionOnline,
                    choice: 'online'
                }]
            });
            done();
        });
    });

    describe('action()', () => {
        it('test that Online IHT context variables are removed if Paper Option chosen', () => {
            let formdata = {};
            let ctx = {
                method: content.optionPaper,
                identifier: '1234567890',
                grossValueOnline: '500000',
                netValueOnline: '400000'
            };
            [ctx, formdata] = IhtMethod.action(ctx, formdata);
            expect(ctx).to.deep.equal({
                method: content.optionPaper
            });
        });

        it('test that Paper IHT context variables are removed if Online Option chosen', () => {
            let formdata = {};
            let ctx = {
                method: content.optionOnline,
                form: 'IHT205',
                ihtFormId: 'IHT205',
                grossIHT205: '500000',
                netIHT205: '400000'
            };
            [ctx, formdata] = IhtMethod.action(ctx, formdata);
            expect(ctx).to.deep.equal({
                method: content.optionOnline
            });
        });
    });
});
