const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const WillHasVisibleDamage = steps.WillHasVisibleDamage;

describe('WillHasVisibleDamage', () => {

    const ctxBeforePost = {
        willHasVisibleDamage: 'optionYes',
        willDamageTypes: [
            'stapleOrPunchHoles',
            'rustMarks',
            'paperClipMarks',
            'tornEdges',
            'waterDamage',
            'otherVisibleDamage'
        ],
        otherDamageDescription: 'further description of how the will was damaged'
    };
    const ctxAfterPost = {
        willHasVisibleDamage: 'optionYes',
        willDamage: {
            damageTypesList: [
                'stapleOrPunchHoles',
                'rustMarks',
                'paperClipMarks',
                'tornEdges',
                'waterDamage',
                'otherVisibleDamage'
            ],
            otherDamageDescription: 'further description of how the will was damaged'
        },
    };
    const ctxWithNo = {
        willHasVisibleDamage: 'optionNo',
    };
    const ctxWithNoDamageTypes = {
        willHasVisibleDamage: 'optionYes',
    };

    const ctxWithNoAndOtherWillConditionValues = {
        willHasVisibleDamage: 'optionNo',
        willDamage: {damageTypesList: []},
        willDamageReasonKnown: 'optionYes',
        willDamageReasonDescription: 'Reason Description',
        willDamageCulpritKnown: 'optionYes',
        willDamageCulpritName: {firstName: 'FN1', lastName: 'LN1'}
    };

    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = WillHasVisibleDamage.constructor.getUrl();
            expect(url).to.equal('/will-has-damage');
            done();
        });
    });

    describe('handleGet()', () => {
        it('should return the ctx with will damage options with before post context', (done) => {
            const [ctx] = WillHasVisibleDamage.handleGet(ctxBeforePost);
            expect(ctx).to.deep.equal({
                willHasVisibleDamage: 'optionYes',
                willDamageTypes: [
                    'stapleOrPunchHoles',
                    'rustMarks',
                    'paperClipMarks',
                    'tornEdges',
                    'waterDamage',
                    'otherVisibleDamage'
                ],
                otherDamageDescription: 'further description of how the will was damaged'
            });
            done();
        });
        it('should return the ctx with NO will damage options with before post context', (done) => {
            const [ctx] = WillHasVisibleDamage.handleGet(ctxWithNoDamageTypes);
            expect(ctx).to.deep.equal({
                willHasVisibleDamage: 'optionYes',
            });
            done();
        });
        it('should return the ctx with will damage options with after post context', (done) => {
            const [ctx] = WillHasVisibleDamage.handleGet(ctxAfterPost);
            expect(ctx).to.deep.equal({
                willHasVisibleDamage: 'optionYes',
                willDamage: {
                    damageTypesList: [
                        'stapleOrPunchHoles',
                        'rustMarks',
                        'paperClipMarks',
                        'tornEdges',
                        'waterDamage',
                        'otherVisibleDamage'
                    ],
                    otherDamageDescription: 'further description of how the will was damaged'
                },
                otherDamageDescription: 'further description of how the will was damaged',
                options: {
                    'stapleOrPunchHoles': true,
                    'rustMarks': true,
                    'paperClipMarks': true,
                    'tornEdges': true,
                    'waterDamage': true,
                    'otherVisibleDamage': true
                }
            });
            done();
        });
        it('should return the ctx with will No damage options', (done) => {
            const [ctx] = WillHasVisibleDamage.handleGet(ctxWithNo);
            expect(ctx).to.deep.equal({
                willHasVisibleDamage: 'optionNo'
            });
            done();
        });
    });

    describe('handlePost()', () => {
        const WillHasVisibleDamage = steps.WillHasVisibleDamage;
        it('add damageTypesList and otherDamageDescription to willDamageTypes object', () => {
            const [ctx] = WillHasVisibleDamage.handlePost(ctxBeforePost);
            assert.containsAllKeys(ctx.willDamage, ['damageTypesList', 'otherDamageDescription']);
            assert.containsAllKeys(ctx.willDamage.damageTypesList, ['0', '1',
                '2', '3', '4', '5']);
        });
        it ('add empty damageTypesList and description for No selected', () => {
            const [ctx] = WillHasVisibleDamage.handlePost(ctxWithNo);
            assert.equal(ctx.willDamage, null);
        });
        it('should reset all other will condidition values if they exist if user selects no', () => {
            const [ctx] = WillHasVisibleDamage.handlePost(ctxWithNoAndOtherWillConditionValues);
            expect(ctx).to.deep.equal({
                willHasVisibleDamage: 'optionNo',
                willDamage: {},
                willDamageReasonKnown: 'optionNo',
                willDamageReasonDescription: '',
                willDamageCulpritKnown: 'optionNo',
                willDamageCulpritName: {}
            });
        });
    });

    describe('action()', () => {
        let formdata = {};
        let ctx = {};
        it('removes the correct values if there is visible damage to the will', (done) => {
            [ctx, formdata] = WillHasVisibleDamage.action(ctxAfterPost, formdata);
            expect(ctx).to.deep.equal({
                willHasVisibleDamage: 'optionYes',
                willDamage: {
                    damageTypesList: [
                        'stapleOrPunchHoles',
                        'rustMarks',
                        'paperClipMarks',
                        'tornEdges',
                        'waterDamage',
                        'otherVisibleDamage'
                    ],
                    otherDamageDescription: 'further description of how the will was damaged',
                }
            });
            done();
        });

        it('removes the correct values from context when no visible damage to the will', (done) => {
            [ctx, formdata] = WillHasVisibleDamage.action(ctxWithNo, formdata);
            expect(ctx).to.deep.equal({
                willHasVisibleDamage: 'optionNo'
            });
            done();
        });
    });

    describe('resetValues()', () => {
        it('should reset values for no damage', (done) => {
            const ctx = {
                willDamageReasonKnown: 'optionYes',
                willDamageReasonDescription: 'desc',
                willDamageCulpritKnown: 'optionYes',
                willDamageCulpritName: {
                    firstName: 'fn',
                    lastName: 'ln'
                },
                willDamageDateKnown: 'optionYes',
                willDamageDate: '/12/2020'
            };
            WillHasVisibleDamage.resetValues(ctx);
            expect(ctx.willDamageReasonKnown).to.equal('optionNo');
            expect(ctx.willDamageReasonDescription).to.equal('');
            expect(ctx.willDamageCulpritKnown).to.equal('optionNo');
            expect(ctx.willDamageCulpritName).to.eql({});
            expect(ctx.willDamageDateKnown).to.equal('optionNo');
            expect(ctx.willDamageDate).to.equal('');
            done();
        });
    });
});
