'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const journey = require('app/journeys/intestacy');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const AnyOtherHalfSiblings = steps.AnyOtherHalfSiblings;

describe('AnyOtherHalfSiblings', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AnyOtherHalfSiblings.constructor.getUrl();
            expect(url).to.equal('/deceased-other-half-siblings');
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

            const ctx = AnyOtherHalfSiblings.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = AnyOtherHalfSiblings.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'anyOtherHalfSiblings', value: 'optionYes', choice: 'hadOtherOtherHalfSiblings'}
                ]
            });
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when deceased has other half-siblings', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                anyOtherHalfSiblings: 'optionYes',
                relationshipToDeceased: 'optionSibling'
            };
            const nextStepUrl = AnyOtherHalfSiblings.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/deceased-half-siblings');
            done();
        });
        it('should return the correct url deceased has no other half-siblings', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                anyOtherHalfSiblings: 'optionNo',
                relationshipToDeceased: 'optionSibling'
            };
            const nextStepUrl = AnyOtherHalfSiblings.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/applicant-name');
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                anyOtherHalfSiblings: 'optionNo',
                anyPredeceasedHalfSiblings: 'optionYesSome',
                anySurvivingHalfNiecesAndHalfNephews: 'optionYes',
                allHalfNiecesAndHalfNephewsOver18: 'optionYes',
                allHalfSiblingsOver18: 'optionYes'
            };
            const formdata = {
                deceased: {
                    anyOtherHalfSiblings: 'optionYes'
                }
            };

            AnyOtherHalfSiblings.action(ctx, formdata);

            assert.isUndefined(ctx.allHalfSiblingsOver18);
            assert.isUndefined(ctx.anyPredeceasedHalfSiblings);
            assert.isUndefined(ctx.allHalfNiecesAndHalfNephewsOver18);
        });
    });
});
