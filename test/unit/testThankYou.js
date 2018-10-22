const {expect} = require('chai');
const initSteps = require('app/core/initSteps');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

describe('ThankYou unit tests', () => {

    describe('getUrl()', () => {
        it('should return correct url', (done) => {
            const thankYou = steps.ThankYou;
            const url = thankYou.constructor.getUrl();
            expect(url).to.equal('/thankyou');
            done();
        });
    });

    describe('handleGet()', () => {

        it('returns true when formdata has no softstops', (done) => {
            const completedForm = require('test/data/complete-form').formdata;
            const testCtx = {};
            const thankYou = steps.ThankYou;
            const [ctx] = thankYou.handleGet(testCtx, completedForm);

            expect(ctx.softStop).to.equal(true);
            done();
        });

        it('returns false when formdata has no softstops', (done) => {
            const completedForm = require('test/data/complete-form').formdata;
            completedForm.deceased.married = 'No';
            const testCtx = {};
            const thankYou = steps.ThankYou;
            const [ctx] = thankYou.handleGet(testCtx, completedForm);

            expect(ctx.softStop).to.equal(false);
            done();
        });
    });

});
