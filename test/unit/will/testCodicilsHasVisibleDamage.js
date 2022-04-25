const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const CodicilsHasVisibleDamage = steps.CodicilsHasVisibleDamage;

describe('CodicilsHasVisibleDamage', () => {
    const ctxBeforePost = {
        codicilsHasVisibleDamage: 'optionYes',
        codicilsDamageTypes: [
            'stapleOrPunchHoles',
            'rustMarks',
            'paperClipMarks',
            'tornEdges',
            'waterDamage',
            'otherVisibleDamage'
        ],
        otherDamageDescription: 'further description of how the codicils were damaged'
    };
    const ctxAfterPost = {
        codicilsHasVisibleDamage: 'optionYes',
        codicilsDamage: {
            damageTypesList: [
                'stapleOrPunchHoles',
                'rustMarks',
                'paperClipMarks',
                'tornEdges',
                'waterDamage',
                'otherVisibleDamage'
            ],
            otherDamageDescription: 'further description of how the codicils were damaged'
        }
    };
    const ctxWithNoDamageTypes = {
        codicilsHasVisibleDamage: 'optionYes',
    };
    const ctxWithNo = {
        codicilsHasVisibleDamage: 'optionNo'
    };
    const ctxWithNoAndOtherCodicilsConditionValues = {
        codicilsHasVisibleDamage: 'optionNo',
        codicilsDamage: {damageTypesList: []},
    };

    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = CodicilsHasVisibleDamage.constructor.getUrl();
            expect(url).to.equal('/codicils-have-damage');
            done();
        });
    });

    describe('handleGet()', () => {
        it('should return the ctx with codicils damage options with before post context', (done) => {
            const [ctx] = CodicilsHasVisibleDamage.handleGet(ctxBeforePost);
            expect(ctx).to.deep.equal({
                codicilsHasVisibleDamage: 'optionYes',
                codicilsDamageTypes: [
                    'stapleOrPunchHoles',
                    'rustMarks',
                    'paperClipMarks',
                    'tornEdges',
                    'waterDamage',
                    'otherVisibleDamage'
                ],
                otherDamageDescription: 'further description of how the codicils were damaged'
            });
            done();
        });
        it('should return the ctx with NO codicils damage options with before post context', (done) => {
            const [ctx] = CodicilsHasVisibleDamage.handleGet(ctxWithNoDamageTypes);
            expect(ctx).to.deep.equal({
                codicilsHasVisibleDamage: 'optionYes',
            });
            done();
        });
        it('should return the ctx with codicils damage options with after post context', (done) => {
            const [ctx] = CodicilsHasVisibleDamage.handleGet(ctxAfterPost);
            expect(ctx).to.deep.equal({
                codicilsHasVisibleDamage: 'optionYes',
                codicilsDamage: {
                    damageTypesList: [
                        'stapleOrPunchHoles',
                        'rustMarks',
                        'paperClipMarks',
                        'tornEdges',
                        'waterDamage',
                        'otherVisibleDamage'
                    ],
                    otherDamageDescription: 'further description of how the codicils were damaged'
                },
                otherDamageDescription: 'further description of how the codicils were damaged',
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
        it('should return the ctx with codicil no damage options', (done) => {
            const [ctx] = CodicilsHasVisibleDamage.handleGet(ctxWithNo);
            expect(ctx).to.deep.equals({
                codicilsHasVisibleDamage: 'optionNo'
            });
            done();
        });
    });

    describe('handlePost()', () => {
        const CodicilsHasVisibleDamage = steps.CodicilsHasVisibleDamage;
        it('add damageTypesList and otherDamageDescription to codicilsDamageTypes object', () => {
            const [ctx] = CodicilsHasVisibleDamage.handlePost(ctxBeforePost);
            assert.containsAllKeys(ctx.codicilsDamage, ['damageTypesList', 'otherDamageDescription']);
            assert.containsAllKeys(ctx.codicilsDamage.damageTypesList, ['0', '1',
                '2', '3', '4', '5']);
        });
        it ('add empty damageTypesList and description for No selected', () => {
            const [ctx] = CodicilsHasVisibleDamage.handlePost(ctxWithNo);
            assert.equal(ctx.codicilsDamage, null);
        });
        it('should reset all other codicils condidition values if they exist if user selects no', () => {
            const [ctx] = CodicilsHasVisibleDamage.handlePost(ctxWithNoAndOtherCodicilsConditionValues);
            expect(ctx).to.deep.equal({
                codicilsHasVisibleDamage: 'optionNo',
                codicilsDamage: {},
            });
        });
    });

    describe('action()', () => {
        let formdata = {};
        let ctx = {};
        it('removes the correct values if there is visible damage to the codicils', (done) => {
            [ctx, formdata] = CodicilsHasVisibleDamage.action(ctxAfterPost, formdata);
            expect(ctx).to.deep.equal({
                codicilsHasVisibleDamage: 'optionYes',
                codicilsDamage: {
                    damageTypesList: [
                        'stapleOrPunchHoles',
                        'rustMarks',
                        'paperClipMarks',
                        'tornEdges',
                        'waterDamage',
                        'otherVisibleDamage'
                    ],
                    otherDamageDescription: 'further description of how the codicils were damaged',
                }
            });
            done();
        });

        it('removes the correct values from context when no visible damage to the will', (done) => {
            [ctx, formdata] = CodicilsHasVisibleDamage.action(ctxWithNo, formdata);
            expect(ctx).to.deep.equal({
                codicilsHasVisibleDamage: 'optionNo',
            });
            done();
        });
    });
});
