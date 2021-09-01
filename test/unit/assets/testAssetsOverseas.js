'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const AssetsOverseas = steps.AssetsOverseas;

describe('AssetsOutside', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AssetsOverseas.constructor.getUrl();
            expect(url).to.equal('/assets-overseas*');
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

            ctx = AssetsOverseas.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = AssetsOverseas.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'assetsoverseas',
                    value: 'optionYes',
                    choice: 'assetsoverseas'
                }]
            });
            done();
        });
    });

    describe('action()', () => {
        it('test that context variables are removed and empty object returned', () => {
            let formdata = {};
            let ctx = {
                deceasedName: 'Dee Ceased'
            };
            [ctx, formdata] = AssetsOverseas.action(ctx, formdata);
            expect(ctx).to.deep.equal({});
        });
    });
});
