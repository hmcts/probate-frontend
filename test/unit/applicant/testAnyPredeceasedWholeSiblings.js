'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const AnyPredeceasedWholeSiblings = steps.AnyPredeceasedWholeSiblings;

describe('AnyPredeceasedWholeSiblings', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AnyPredeceasedWholeSiblings.constructor.getUrl();
            expect(url).to.equal('/deceased-whole-siblings');
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

            const ctx = AnyPredeceasedWholeSiblings.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = AnyPredeceasedWholeSiblings.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'hadSomeOrAllPredeceasedWholeSibling', value: true, choice: 'hadSomeOrAllPredeceasedWholeSibling'},
                    {key: 'anyPredeceasedWholeSiblings', value: 'optionNo', choice: 'optionNo'}
                ]
            });
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                deceasedName: 'Dee Ceased',
                anyPredeceasedWholeSiblings: 'optionYesSome',
                allWholeNiecesAndWholeNephewsOver18: 'optionYes',
                allWholeSiblingsOver18: 'optionYes'
            };
            const formdata = {
                deceased: {
                    anyPredeceasedWholeSiblings: 'optionYesAll'
                }
            };

            AnyPredeceasedWholeSiblings.action(ctx, formdata);

            assert.isUndefined(ctx.deceasedName);
            assert.isUndefined(ctx.allWholeNiecesAndWholeNephewsOver18);
            assert.isUndefined(ctx.allWholeSiblingsOver18);
        });
    });
});
