const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const WillDamageCulpritKnown = steps.WillDamageCulpritKnown;

describe('WillDamageCulpritKnown', () => {

    const ctxBeforePost = {
        willDamageCulpritKnown: 'optionYes',
        firstName: 'Culprit first name',
        lastName: 'Culprit last name'
    };
    const ctxWithNo = {
        willDamageCulpritKnown: 'optionNo',
    };

    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = WillDamageCulpritKnown.constructor.getUrl();
            expect(url).to.equal('/will-damage-who');
            done();
        });
    });

    describe('handlePost()', () => {
        const willDamageCulpritKnown = steps.WillDamageCulpritKnown;
        it('add firstName and lastName to willDamageCulpritName object', () => {
            const [ctx] = willDamageCulpritKnown.handlePost(ctxBeforePost);
            assert.containsAllKeys(ctx.willDamageCulpritName, ['firstName', 'lastName']);
        });
        it ('add empty willDamageCulpritName for No selected', () => {
            const [ctx] = willDamageCulpritKnown.handlePost(ctxWithNo);
            assert.equal(ctx.willDamageCulpritName, null);
            assert.equal(ctx.firstName, null);
            assert.equal(ctx.lastName, null);
        });
    });

    describe('action()', () => {
        let formdata = {};
        let ctx = {
            willDamageCulpritKnown: 'optionYes',
            willDamageCulpritName: {firstName: 'FN1', lastName: 'LN1'},
            firstName: 'FN1',
            lastName: 'LN1'
        };
        it ('removes the correct values from the context when will damage culrpit is known', (done) => {
            [ctx, formdata] = WillDamageCulpritKnown.action(ctx, formdata);
            expect(ctx).to.deep.equal({
                willDamageCulpritKnown: 'optionYes',
                willDamageCulpritName: {firstName: 'FN1', lastName: 'LN1'},
            });
            done();
        });

        it ('removes the correct values from the context when will damage culrpit is not known', (done) => {
            ctx.willDamageCulpritKnown = 'optionNo';
            [ctx, formdata] = WillDamageCulpritKnown.action(ctx, formdata);
            expect(ctx).to.deep.equal({
                willDamageCulpritKnown: 'optionNo',
                willDamageCulpritName: {}
            });
            done();
        });
    });
});
