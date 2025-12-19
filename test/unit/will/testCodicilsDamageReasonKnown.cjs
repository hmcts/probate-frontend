const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const CodicilsDamageReasonKnown = steps.CodicilsDamageReasonKnown;

describe('CodicilsDamageReasonKnown', () => {

    const ctxWithYes = {
        codicilsDamageReasonKnown: 'optionYes',
        codicilsDamageReasonDescription: 'Damage description'
    };

    const ctxWithNo = {
        codicilsDamageReasonKnown: 'optionNo'
    };

    const ctxWithNoAndDescription = {
        codicilsDamageReasonKnown: 'optionNo',
        codicilsDamageReasonDescription: 'Damage description'
    };

    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = CodicilsDamageReasonKnown.constructor.getUrl();
            expect(url).to.equal('/codicils-damage-reason');
            done();
        });
    });

    describe('handleGet()', () => {
        it('should return the ctx with codicils damage reason', (done) => {
            const [ctx] = CodicilsDamageReasonKnown.handleGet(ctxWithYes);
            expect(ctx).to.deep.equal({
                codicilsDamageReasonKnown: 'optionYes',
                codicilsDamageReasonDescription: 'Damage description'
            });
            done();
        });
    });

    describe('handlePost()', () => {
        const CodicilsDamageReasonKnown = steps.CodicilsDamageReasonKnown;
        it ('add reasonKnown and reason Description', () => {
            const [ctx] = CodicilsDamageReasonKnown.handlePost(ctxWithYes);
            expect(ctx).to.deep.equal(ctxWithYes);
        });

        it ('set reason description to blank if exists and no reason known', () => {
            const [ctx] = CodicilsDamageReasonKnown.handlePost(ctxWithNoAndDescription);
            expect(ctx).to.deep.equal({
                codicilsDamageReasonKnown: 'optionNo',
                codicilsDamageReasonDescription: ''
            });
        });

        it ('add reasonKnown NO', () => {
            const [ctx] = CodicilsDamageReasonKnown.handlePost(ctxWithNo);
            expect(ctx).to.deep.equal(ctxWithNo);
        });
    });

});
