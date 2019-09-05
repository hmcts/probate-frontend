'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const IhtMethod = steps.IhtMethod;
const content = require('app/resources/en/translation/iht/method');
const contentAssetsOutside = require('app/resources/en/translation/iht/assetsoutside');
const contentAnyChildren = require('app/resources/en/translation/deceased/anychildren');
const contentAllChildrenOver18 = require('app/resources/en/translation/deceased/allchildrenover18');
const contentAnyDeceasedChildren = require('app/resources/en/translation/deceased/anydeceasedchildren');
const contentAnyGrandChildrenUnder18 = require('app/resources/en/translation/deceased/anygrandchildrenunder18');

describe('IhtMethod', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = IhtMethod.constructor.getUrl();
            expect(url).to.equal('/iht-method');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct next step options', (done) => {
            const result = IhtMethod.nextStepOptions();
            expect(result).to.deep.equal({
                options: [{
                    key: 'method',
                    value: content.optionOnline,
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
                    method: content.optionOnline
                },
                deceased: {
                    anyChildren: contentAnyChildren.optionYes,
                    allChildrenOver18: contentAllChildrenOver18.optionYes,
                    anyDeceasedChildren: contentAnyDeceasedChildren.optionYes,
                    anyGrandchildrenUnder18: contentAnyGrandChildrenUnder18.optionNo
                }
            };
            let ctx = {
                method: content.optionPaper,
                identifier: '1234567890',
                grossValueField: '500000',
                netValueField: '400000',

                assetsOutside: contentAssetsOutside.optionYes,
                netValueAssetsOutsideField: '150000',
                netValueAssetsOutside: 150000
            };
            [ctx, formdata] = IhtMethod.action(ctx, formdata);
            expect(ctx).to.deep.equal({
                method: content.optionPaper
            });
            expect(formdata).to.deep.equal({
                iht: {
                    method: content.optionOnline
                },
                deceased: {}
            });
        });

        it('test it cleans up context and formdata if Online Option chosen', () => {
            let formdata = {
                iht: {
                    method: content.optionPaper
                },
                deceased: {
                    anyChildren: contentAnyChildren.optionYes,
                    allChildrenOver18: contentAllChildrenOver18.optionYes,
                    anyDeceasedChildren: contentAnyDeceasedChildren.optionYes,
                    anyGrandchildrenUnder18: contentAnyGrandChildrenUnder18.optionNo
                }
            };
            let ctx = {
                method: content.optionOnline,
                form: 'IHT205',
                ihtFormId: 'IHT205',
                grossValueIHT205: '500000',
                netValueIHT205: '400000',

                assetsOutside: contentAssetsOutside.optionYes,
                netValueAssetsOutsideField: '150000',
                netValueAssetsOutside: 150000
            };
            [ctx, formdata] = IhtMethod.action(ctx, formdata);
            expect(ctx).to.deep.equal({
                method: content.optionOnline
            });
            expect(formdata).to.deep.equal({
                iht: {
                    method: content.optionPaper
                },
                deceased: {}
            });
        });
    });
});
