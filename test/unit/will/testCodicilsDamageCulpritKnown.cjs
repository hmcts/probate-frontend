const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const CodicilsDamageCulpritKnown = steps.CodicilsDamageCulpritKnown;

describe('codicilsDamageCulpritKnown', () => {

    const ctxBeforePost = {
        codicilsDamageCulpritKnown: 'optionYes',
        firstName: 'Culprit first name',
        lastName: 'Culprit last name'
    };
    const ctxWithNo = {
        codicilsDamageCulpritKnown: 'optionNo',
    };

    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = CodicilsDamageCulpritKnown.constructor.getUrl();
            expect(url).to.equal('/codicils-damage-who');
            done();
        });
    });

    describe('handlePost()', () => {
        it('add firstName and lastName to codicilsDamageCulpritName object', () => {
            const [ctx] = CodicilsDamageCulpritKnown.handlePost(ctxBeforePost);
            assert.containsAllKeys(ctx.codicilsDamageCulpritName, ['firstName', 'lastName']);
        });
        it ('add empty codicilsDamageCulpritName for No selected', () => {
            const [ctx] = CodicilsDamageCulpritKnown.handlePost(ctxWithNo);
            assert.equal(ctx.codicilsDamageCulpritName, null);
            assert.equal(ctx.firstName, null);
            assert.equal(ctx.lastName, null);
        });
    });

    describe('action()', () => {
        let formdata = {};
        let ctx = {
            codicilsDamageCulpritKnown: 'optionYes',
            codicilsDamageCulpritName: {firstName: 'FN1', lastName: 'LN1'},
            firstName: 'FN1',
            lastName: 'LN1'
        };
        it ('removes the correct values from the context when codicils damage culrpit is known', (done) => {
            [ctx, formdata] = CodicilsDamageCulpritKnown.action(ctx, formdata);
            expect(ctx).to.deep.equal({
                codicilsDamageCulpritKnown: 'optionYes',
                codicilsDamageCulpritName: {firstName: 'FN1', lastName: 'LN1'},
            });
            done();
        });

        it ('removes the correct values from the context when codicils damage culrpit is not known', (done) => {
            ctx.codicilsDamageCulpritKnown = 'optionNo';
            [ctx, formdata] = CodicilsDamageCulpritKnown.action(ctx, formdata);
            expect(ctx).to.deep.equal({
                codicilsDamageCulpritKnown: 'optionNo',
                codicilsDamageCulpritName: {}
            });
            done();
        });
    });
});
