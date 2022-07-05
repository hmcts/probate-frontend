const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const DeceasedwrittenWishes = steps.DeceasedWrittenWishes;

describe('DeceasedWrittenWishes', () => {
    const ctxWithYes = {
        deceasedWrittenWishes: 'optionYes',
    };
    const ctxWithNo = {
        deceasedWrittenWishes: 'optionNo'
    };
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedwrittenWishes.constructor.getUrl();
            expect(url).to.equal('/deceased-written-wishes');
            done();
        });
    });

    describe('handleGet()', () => {
        it('should return the ctx with codicils damage options with before post context', (done) => {
            const [ctx] = DeceasedwrittenWishes.handleGet(ctxWithNo);
            expect(ctx).to.deep.equal({
                deceasedWrittenWishes: 'optionNo'
            });
            done();
        });
        it('should return the ctx with codicils damage options with after post context', (done) => {
            const [ctx] = DeceasedwrittenWishes.handleGet(ctxWithYes);
            expect(ctx).to.deep.equal({
                deceasedWrittenWishes: 'optionYes'
            });
            done();
        });
    });

    describe('handlePost()', () => {
        it('add damageTypesList and otherDamageDescription to codicilsDamageTypes object', () => {
            const [ctx] = DeceasedwrittenWishes.handlePost(ctxWithYes);
            assert.equal(ctx.deceasedWrittenWishes, 'optionYes');
        });
    });

    describe('action()', () => {
        let formdata = {};
        let ctx = {};
        it('removes the correct values if there is visible damage to the codicils', (done) => {
            [ctx, formdata] = DeceasedwrittenWishes.action(ctxWithNo, formdata);
            assert.equal(ctx.deceasedWrittenWishes, 'optionNo');
            done();
        });

        it('removes the correct values from context when no visible damage to the will', (done) => {
            [ctx, formdata] = DeceasedwrittenWishes.action(ctxWithNo, formdata);
            expect(ctx).to.deep.equal({
                deceasedWrittenWishes: 'optionNo',
            });
            done();
        });
    });
});
