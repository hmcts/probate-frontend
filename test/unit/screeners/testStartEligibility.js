'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const startEligibility = steps.StartEligibility;

describe('StartEligibility', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = startEligibility.constructor.getUrl();
            expect(url).to.equal('/start-eligibility');
            done();
        });
    });

    describe('handleGet()', () => {
        it('should return true when the fees_api and the copies_fees toggles are set', (done) => {
            const ctxToTest = {};
            const formdata = {};
            const featureToggles = {
                fees_api: true,
                copies_fees: true
            };
            const [ctx] = startEligibility.handleGet(ctxToTest, formdata, featureToggles);
            expect(ctx.isFeesApiToggleEnabled).to.equal(true);
            expect(ctx.isCopiesFeesToggleEnabled).to.equal(true);
            done();
        });

        it('should return false when the fees_api and the copies_fees toggles are not set', (done) => {
            const ctxToTest = {};
            const formdata = {};
            const featureToggles = {};
            const [ctx] = startEligibility.handleGet(ctxToTest, formdata, featureToggles);
            expect(ctx.isFeesApiToggleEnabled).to.equal(false);
            expect(ctx.isCopiesFeesToggleEnabled).to.equal(false);
            done();
        });
    });
});
