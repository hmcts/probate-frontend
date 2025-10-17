'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const AnySurvivingGrandchildren = steps.AnySurvivingGrandchildren;

describe('AnySurvivingGrandchildren', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AnySurvivingGrandchildren.constructor.getUrl();
            expect(url).to.equal('/any-surviving-grandchildren');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the context with the deceased name', (done) => {
            const req = {
                session: {
                    form: {
                        deceased: {
                            firstName: 'John',
                            lastName: 'Doe'
                        }
                    }
                }
            };

            const ctx = AnySurvivingGrandchildren.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = AnySurvivingGrandchildren.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'anySurvivingGrandchildren', value: 'optionYes', choice: 'hadSurvivingGrandchildren'},
                    {key: 'hadOtherChildrenAndHadNoSurvivingGrandchildren', value: true, choice: 'hadOtherChildrenAndHadNoSurvivingGrandchildren'},
                    {key: 'hadNoOtherChildrenAndHadNoSurvivingGrandchildren', value: true, choice: 'hadNoOtherChildrenAndHadNoSurvivingGrandchildren'},
                ]
            });
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                deceasedName: 'Dee Ceased',
                anyPredeceasedChildren: 'optionYesSome',
                anySurvivingGrandchildren: 'optionYes',
                anyGrandchildrenUnder18: 'optionNo',
                allChildrenOver18: 'optionYes'
            };
            const formdata = {
                deceased: {
                    anySurvivingGrandchildren: 'optionNo'
                }
            };

            AnySurvivingGrandchildren.action(ctx, formdata);
            assert.isUndefined(ctx.anyGrandchildrenUnder18);
        });
    });
});
