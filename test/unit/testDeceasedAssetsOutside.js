'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const AssetsOutside = steps.AssetsOutside;
const content = require('app/resources/en/translation/deceased/assetsoutside');

describe('AssetsOutside', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AssetsOutside.constructor.getUrl();
            expect(url).to.equal('/assets-outside-england-wales');
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
            const ctx = {};
            const nextStepOptions = AssetsOutside.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'assetsOutside',
                    value: content.optionYes,
                    choice: 'hasAssetsOutside'
                }]
            });
            done();
        });
    });
});
