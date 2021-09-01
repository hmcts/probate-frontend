'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const IhtMethod = steps.IhtMethod;

describe('IhtMethod', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = IhtMethod.constructor.getUrl();
            expect(url).to.equal('/iht-method*');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct next step options', (done) => {
            const result = IhtMethod.nextStepOptions();
            expect(result).to.deep.equal({
                options: [{
                    key: 'method',
                    value: 'optionOnline',
                    choice: 'online'
                }]
            });
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context and formdata if Paper Option chosen', () => {
            let formdata = {
                iht: {
                    method: 'optionOnline'
                },
                deceased: {
                    anyChildren: 'optionYes',
                    allChildrenOver18: 'optionYes',
                    anyDeceasedChildren: 'optionYes',
                    anyGrandchildrenUnder18: 'optionNo'
                }
            };
            let ctx = {
                method: 'optionPaper',
                identifier: '1234567890',
                grossValueField: '500000',
                netValueField: '400000',

                assetsOutside: 'optionYes',
                netValueAssetsOutsideField: '150000',
                netValueAssetsOutside: 150000
            };
            [ctx, formdata] = IhtMethod.action(ctx, formdata);
            expect(ctx).to.deep.equal({
                method: 'optionPaper'
            });
            expect(formdata).to.deep.equal({
                iht: {
                    method: 'optionOnline'
                },
                deceased: {}
            });
        });

        it('test it cleans up context and formdata if Online Option chosen', () => {
            let formdata = {
                iht: {
                    method: 'optionPaper'
                },
                deceased: {
                    anyChildren: 'optionYes',
                    allChildrenOver18: 'optionYes',
                    anyDeceasedChildren: 'optionYes',
                    anyGrandchildrenUnder18: 'optionNo'
                }
            };
            let ctx = {
                method: 'optionOnline',
                form: 'optionIHT205',
                ihtFormId: 'optionIHT205',
                grossValueIHT205: '500000',
                netValueIHT205: '400000',

                assetsOutside: 'optionYes',
                netValueAssetsOutsideField: '150000',
                netValueAssetsOutside: 150000
            };
            [ctx, formdata] = IhtMethod.action(ctx, formdata);
            expect(ctx).to.deep.equal({
                method: 'optionOnline'
            });
            expect(formdata).to.deep.equal({
                iht: {
                    method: 'optionPaper'
                },
                deceased: {}
            });
        });
    });
});
