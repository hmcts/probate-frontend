'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const DiedEnglandOrWales = steps.DiedEnglandOrWales;

describe('DiedEnglandOrWales', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DiedEnglandOrWales.constructor.getUrl();
            expect(url).to.equal('/died-eng-or-wales');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct next step options', (done) => {
            const result = DiedEnglandOrWales.nextStepOptions();
            expect(result).to.deep.equal({
                options: [{
                    key: 'diedEngOrWales',
                    value: 'optionYes',
                    choice: 'hasDiedEngOrWales'
                }]
            });
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

            ctx = DiedEnglandOrWales.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('action()', () => {
        it('test that deceased name is removed from context', () => {
            const formdata = {
                deceased: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            };
            let ctx = {
                deceasedName: 'Dee Ceased',
            };
            [ctx] = DiedEnglandOrWales.action(ctx, formdata);
            expect(ctx).to.deep.equal({});
        });
    });

});
