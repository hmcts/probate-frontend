'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const AssetsOutside = steps.AssetsOutside;

describe('AssetsOutside', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AssetsOutside.constructor.getUrl();
            expect(url).to.equal('/assets-outside-england-wales*');
            done();
        });
    });

    describe('getContextData()', () => {
        let ctx;
        let req;

        it('should return the context with the deceased name', (done) => {
            req = {
                session: {
                    form: {
                        deceased: {
                            firstName: 'John',
                            lastName: 'Doe'
                        }
                    }
                }
            };

            ctx = AssetsOutside.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = AssetsOutside.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'assetsOutside',
                    value: 'optionYes',
                    choice: 'hasAssetsOutside'
                }]
            });
            done();
        });
    });

    describe('action()', () => {
        it('test that the Value of Assets Outside England and Wales context variables are removed if No Assets Outside chosen', () => {
            let formdata = {};
            let ctx = {
                deceasedName: 'Dee Ceased',
                assetsOutside: 'optionNo',
                netValueAssetsOutsideField: '600000',
                netValueAssetsOutside: 600000
            };
            [ctx, formdata] = AssetsOutside.action(ctx, formdata);
            expect(ctx).to.deep.equal({
                assetsOutside: 'optionNo'
            });
        });
    });
});
