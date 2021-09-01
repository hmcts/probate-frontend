'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const AnyOtherChildren = steps.AnyOtherChildren;

describe('AnyOtherChildren', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AnyOtherChildren.constructor.getUrl();
            expect(url).to.equal('/any-other-children*');
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

            const ctx = AnyOtherChildren.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = AnyOtherChildren.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'anyOtherChildren', value: 'optionYes', choice: 'hadOtherChildren'},
                ]
            });
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                anyOtherChildren: 'optionNo',
                allChildrenOver18: 'optionYes',
                anyDeceasedChildren: 'optionYes',
                anyGrandchildrenUnder18: 'optionNo'
            };
            const formdata = {
                deceased: {
                    anyOtherChildren: 'optionYes'
                }
            };

            AnyOtherChildren.action(ctx, formdata);

            assert.isUndefined(ctx.allChildrenOver18);
            assert.isUndefined(ctx.anyDeceasedChildren);
            assert.isUndefined(ctx.anyGrandchildrenUnder18);
        });
    });
});
