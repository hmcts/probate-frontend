'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const AnyDeceasedChildren = steps.AnyDeceasedChildren;
const content = require('app/resources/en/translation/deceased/anydeceasedchildren');

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
        it('cleans up context', () => {
            const ctx = {
                deceasedName: 'Dee Ceased'
            };
            AnyDeceasedChildren.action(ctx);
            assert.isUndefined(ctx.deceasedName);
        });
    });
});
