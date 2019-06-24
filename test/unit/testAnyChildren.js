'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const AnyChildren = steps.AnyChildren;
const content = require('app/resources/en/translation/deceased/anychildren');
const contentAnyChildren = require('app/resources/en/translation/deceased/anychildren');
const contentAllChildrenOver18 = require('app/resources/en/translation/deceased/allchildrenover18');
const contentAnyDeceasedChildren = require('app/resources/en/translation/deceased/anydeceasedchildren');
const contentAnyGrandChildrenUnder18 = require('app/resources/en/translation/deceased/anygrandchildrenunder18');

describe('AnyChildren', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AnyChildren.constructor.getUrl();
            expect(url).to.equal('/any-children');
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
                    {key: 'anyChildren', value: content.optionYes, choice: 'hadChildren'},
                ]
            });
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                deceasedName: 'Dee Ceased',
                anyChildren: contentAnyChildren.optionNo,
                allChildrenOver18: contentAllChildrenOver18.optionYes,
                anyDeceasedChildren: contentAnyDeceasedChildren.optionYes,
                anyGrandchildrenUnder18: contentAnyGrandChildrenUnder18.optionNo
            };
            const formdata = {
                applicant: {
                    relationshipToDeceased: content.optionAdoptedChild,
                },
                deceased: {
                    anyChildren: contentAnyChildren.optionYes
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
