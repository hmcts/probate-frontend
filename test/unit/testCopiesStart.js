'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const copiesStart = steps.CopiesStart;

describe('CopiesStart', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = copiesStart.constructor.getUrl();
            expect(url).to.equal('/copies-start');
            done();
        });
    });

    describe('handleGet()', () => {
        it('should return true when the copies_fees toggles is set', (done) => {
            const ctxToTest = {};
            const formdata = {};
            const featureToggles = {
                copies_fees: true
            };
            const [ctx] = copiesStart.handleGet(ctxToTest, formdata, featureToggles);
            expect(ctx.isCopiesFeesToggleEnabled).to.equal(true);
            done();
        });

        it('should return false when the copies_fees toggle is not set', (done) => {
            const ctxToTest = {};
            const formdata = {};
            const featureToggles = {};
            const [ctx] = copiesStart.handleGet(ctxToTest, formdata, featureToggles);
            expect(ctx.isCopiesFeesToggleEnabled).to.equal(false);
            done();
        });
    });
});
