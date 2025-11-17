'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const AnyLivingParents = steps.AnyLivingParents;

describe('AnyLivingParents', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AnyLivingParents.constructor.getUrl();
            expect(url).to.equal('/any-living-parents');
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

            const ctx = AnyLivingParents.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = AnyLivingParents.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'anyLivingParents', value: 'optionNo', choice: 'hasNoLivingParents'}
                ]
            });
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                deceasedName: 'Dee Ceased',
            };
            const formdata = {
                deceased: {
                    anyLivingParents: 'optionYes'
                }
            };

            AnyLivingParents.action(ctx, formdata);

            assert.isUndefined(ctx.deceasedName);
        });
    });
});
