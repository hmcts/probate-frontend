'use strict';

const initSteps = require('app/core/initSteps.cjs');
const expect = require('chai').expect;
const sinon = require('sinon');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const UniqueProbateCode = steps.UniqueProbateCode;

describe('UniqueProbateCode', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            // Create a spy for the getUrl() method
            const getUrlSpy = sinon.spy(UniqueProbateCode.constructor, 'getUrl');
            const url = UniqueProbateCode.constructor.getUrl();
            // Assert that the method was called
            expect(getUrlSpy.called).to.equal(true);
            expect(url).to.equal('/unique-probate-code');
            // Restore the spy
            getUrlSpy.restore();
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
            const replaceSpy = sinon.spy(String.prototype, 'replace');
            [ctx, errors] = UniqueProbateCode.handlePost(ctx, errors, {}, {language: 'en'});
            expect(ctx).to.deep.equal({
                uniqueProbateCodeId: 'CTS04052311043tpps8e9'
            });
            expect(errors.length).equal(0);
            sinon.assert.calledOnce(replaceSpy);
            replaceSpy.restore();
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
