'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const AnyPredeceasedHalfSiblings = steps.AnyPredeceasedHalfSiblings;

describe('AnyPredeceasedHalfSiblings', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AnyPredeceasedHalfSiblings.constructor.getUrl();
            expect(url).to.equal('/deceased-half-siblings');
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

            const ctx = AnyPredeceasedHalfSiblings.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = AnyPredeceasedHalfSiblings.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'hadSomeOrAllPredeceasedHalfSibling', value: true, choice: 'hadSomeOrAllPredeceasedHalfSibling'},
                ]
            });
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                deceasedName: 'Dee Ceased',
                anyPredeceasedHalfSiblings: 'optionYesSome',
                allHalfNiecesAndHalfNephewsOver18: 'optionYes',
                allHalfSiblingsOver18: 'optionYes'
            };
            const formdata = {
                deceased: {
                    anyPredeceasedHalfSiblings: 'optionYesAll'
                }
            };

            AnyPredeceasedHalfSiblings.action(ctx, formdata);

            assert.isUndefined(ctx.deceasedName);
            assert.isUndefined(ctx.allHalfNiecesAndHalfNephewsOver18);
            assert.isUndefined(ctx.allHalfSiblingsOver18);
        });
    });
});
