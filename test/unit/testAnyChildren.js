'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const AnyChildren = steps.AnyChildren;

describe('AnyChildren', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AnyChildren.constructor.getUrl();
            expect(url).to.equal('/any-children*');
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

            const ctx = AnyChildren.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = AnyChildren.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'anyChildren', value: 'optionYes', choice: 'hadChildren'},
                ]
            });
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                deceasedName: 'Dee Ceased',
                anyChildren: 'optionNo',
                allChildrenOver18: 'optionYes',
                anyDeceasedChildren: 'optionYes',
                anyGrandchildrenUnder18: 'optionNo'
            };
            const formdata = {
                applicant: {
                    relationshipToDeceased: 'optionAdoptedChild',
                },
                deceased: {
                    anyChildren: 'optionYes'
                }
            };

            AnyChildren.action(ctx, formdata);

            assert.isUndefined(ctx.deceasedName);

            assert.isUndefined(ctx.allChildrenOver18);
            assert.isUndefined(ctx.anyDeceasedChildren);
            assert.isUndefined(ctx.anyGrandchildrenUnder18);
        });
    });
});
