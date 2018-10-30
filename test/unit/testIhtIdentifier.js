'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const IhtIdentifier = steps.IhtIdentifier;

describe('IhtCompleted', () => {
    describe('getUrl()', () => {
        it('returns the correct url', (done) => {
            const url = IhtIdentifier.constructor.getUrl();
            expect(url).to.equal('/iht-identifier');
            done();
        });
    });

    describe('parseIdentifier()', () => {
        it('has no effect if ctx.identifier is undefined', (done) => {
            const ctx = {};
            IhtIdentifier.parseIdentifier(ctx);
            expect(ctx).to.deep.equal({});
            done();
        });

        it('removes "-" from ctx.identifier', (done) => {
            const ctx = {
                identifier: 'test-string---identifier'
            };
            IhtIdentifier.parseIdentifier(ctx);
            expect(ctx.identifier).to.equal('teststringidentifier');
            done();
        });

        it('removes whitespace from ctx.identifier', (done) => {
            const ctx = {
                identifier: 'test   string        identifier'
            };
            IhtIdentifier.parseIdentifier(ctx);
            expect(ctx.identifier).to.equal('teststringidentifier');
            done();
        });
    });
});
