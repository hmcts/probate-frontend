'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const GrandchildParentHasOtherChildren = steps.GrandchildParentHasOtherChildren;

describe('GrandchildParentHasOtherChildren', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = GrandchildParentHasOtherChildren.constructor.getUrl();
            expect(url).to.equal('/mainapplicantsparent-any-other-children');
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

            const ctx = GrandchildParentHasOtherChildren.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = GrandchildParentHasOtherChildren.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'grandchildParentHasOtherChildren', value: 'optionYes', choice: 'grandchildParentHasOtherChildren'},
                ]
            });
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                grandchildParentHasOtherChildren: 'optionYes',
                grandchildParentHasAllChildrenOver18: 'optionYes',
            };
            const formdata = {
                deceased: {
                    grandchildParentHasOtherChildren: 'optionNo'
                }
            };

            GrandchildParentHasOtherChildren.action(ctx, formdata);

            assert.isUndefined(ctx.grandchildParentHasAllChildrenOver18);
        });
    });
});
