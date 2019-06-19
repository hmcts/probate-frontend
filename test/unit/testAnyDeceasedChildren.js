'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const AnyDeceasedChildren = steps.AnyDeceasedChildren;
const content = require('app/resources/en/translation/deceased/anydeceasedchildren');
const contentAnyDeceasedChildren = require('app/resources/en/translation/deceased/anydeceasedchildren');
const contentAnyGrandChildrenUnder18 = require('app/resources/en/translation/deceased/anygrandchildrenunder18');

describe('AnyDeceasedChildren', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AnyDeceasedChildren.constructor.getUrl();
            expect(url).to.equal('/any-deceased-children');
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

            const ctx = AnyDeceasedChildren.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = AnyDeceasedChildren.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'anyDeceasedChildren', value: content.optionYes, choice: 'hadDeceasedChildren'},
                ]
            });
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                deceasedName: 'Dee Ceased',
                anyDeceasedChildren: contentAnyDeceasedChildren.optionNo,
                anyGrandchildrenUnder18: contentAnyGrandChildrenUnder18.optionNo
            };
            const formdata = {
                deceased: {
                    anyDeceasedChildren: contentAnyDeceasedChildren.optionYes
                }
            };

            AnyDeceasedChildren.action(ctx, formdata);

            assert.isUndefined(ctx.deceasedName);
            assert.isUndefined(ctx.anyGrandchildrenUnder18);
        });
    });
});
