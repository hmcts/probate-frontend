'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const UniqueProbateCode = steps.UniqueProbateCode;

describe('UniqueProbateCode', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = UniqueProbateCode.constructor.getUrl();
            expect(url).to.equal('/unique-probate-code');
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;

        it('should return the ctx with the estate values', (done) => {
            ctx = {
                uniqueProbateCodeId: 'CTS040523 11043 tpps8e9'
            };
            errors = [];
            [ctx, errors] = UniqueProbateCode.handlePost(ctx, errors, {}, {language: 'en'});
            expect(ctx).to.deep.equal({
                uniqueProbateCodeId: 'CTS04052311043tpps8e9'

            });
            expect(errors.length).equal(0);
            done();
        });

    });

    describe('nextStepOptions()', () => {
        it('should remove spaces from uniqueProbateCodeId in ctx', () => {
            const ctx = {
                uniqueProbateCodeId: 'CTS040523 11043 tpps8e9'
            };
            const options = UniqueProbateCode.nextStepOptions(ctx);
            expect(options.uniqueProbateCodeId).to.equal('CTS04052311043tpps8e9');
        });
    });

});
