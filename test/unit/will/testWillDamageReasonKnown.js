const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const WillDamageReasonKnown = steps.WillDamageReasonKnown;

describe('WillDamageReasonKnown', () => {

    const ctxWithYes = {
        willDamageReasonKnown: 'optionYes',
        willDamageReasonDescription: 'Damage description'
    };

    const ctxWithNo = {
        willDamageReasonKnown: 'optionNo'
    };

    const ctxWithNoAndDescription = {
        willDamageReasonKnown: 'optionNo',
        willDamageReasonDescription: 'Damage description'
    };

    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = WillDamageReasonKnown.constructor.getUrl();
            expect(url).to.equal('/will-damage-reason');
            done();
        });
    });

    describe('handleGet()', () => {
        it('should return the ctx with will damage reason', (done) => {
            const [ctx] = WillDamageReasonKnown.handleGet(ctxWithYes);
            expect(ctx).to.deep.equal({
                willDamageReasonKnown: 'optionYes',
                willDamageReasonDescription: 'Damage description'
            });
            done();
        });
    });

    describe('handlePost()', () => {
        const WillDamageReasonKnown = steps.WillDamageReasonKnown;
        it ('add reasonKnown and reason Description', () => {
            const [ctx] = WillDamageReasonKnown.handlePost(ctxWithYes);
            expect(ctx).to.deep.equal(ctxWithYes);
        });

        it ('set reason description to blank if exists and no reason known', () => {
            const [ctx] = WillDamageReasonKnown.handlePost(ctxWithNoAndDescription);
            expect(ctx).to.deep.equal({
                willDamageReasonKnown: 'optionNo',
                willDamageReasonDescription: ''
            });
        });

        it ('add reasonKnown NO', () => {
            const [ctx] = WillDamageReasonKnown.handlePost(ctxWithNo);
            expect(ctx).to.deep.equal(ctxWithNo);
        });
    });

});
