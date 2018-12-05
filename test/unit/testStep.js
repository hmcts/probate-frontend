'use strict';

const Step = require('app/core/steps/Step');
const {expect} = require('chai');

describe('Step.js', () => {
    describe('setEligibilityCookie()', () => {
        it('should return the same req, res, ctx params that are given', (done) => {
            const steps = {};
            const section = null;
            const resourcePath = 'will/left';
            const i18next = {};
            const testReq = {reqParam: 'req value'};
            const testRes = {resParam: 'res value'};
            const testCtx = {ctxParam: 'ctx value'};
            const step = new Step(steps, section, resourcePath, i18next);
            const [req, res, ctx] = step.setEligibilityCookie(testReq, testRes, testCtx);

            expect(req).to.deep.equal({reqParam: 'req value'});
            expect(res).to.deep.equal({resParam: 'res value'});
            expect(ctx).to.deep.equal({ctxParam: 'ctx value'});

            done();
        });
    });
});
