'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const journey = require('app/journeys/intestacy');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const AnySurvivingHalfNiecesAndHalfNephews = steps.AnySurvivingHalfNiecesAndHalfNephews;

describe('AnySurvivingHalfNiecesAndHalfNephews', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AnySurvivingHalfNiecesAndHalfNephews.constructor.getUrl();
            expect(url).to.equal('/half-siblings-surviving-children');
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

            const ctx = AnySurvivingHalfNiecesAndHalfNephews.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when deceased has some predeceased half-siblings and has surviving children for those predeceased', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                anyPredeceasedHalfSiblings: 'optionYesSome',
                anySurvivingHalfNiecesAndHalfNephews: 'optionYes',
                relationshipToDeceased: 'optionSibling'
            };
            const nextStepUrl = AnySurvivingHalfNiecesAndHalfNephews.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/half-nieces-half-nephews-age');
            done();
        });

        it('should return the correct url when deceased has some predeceased half-siblings and has no surviving children for those predeceased', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                anyPredeceasedHalfSiblings: 'optionYesSome',
                anySurvivingHalfNiecesAndHalfNephews: 'optionNo',
                relationshipToDeceased: 'optionSibling'
            };
            const nextStepUrl = AnySurvivingHalfNiecesAndHalfNephews.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/half-siblings-age');
            done();
        });

        it('should return the correct url when deceased has all predeceased half-siblings and has no surviving children for those predeceased', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                anyPredeceasedHalfSiblings: 'optionYesAll',
                anySurvivingHalfNiecesAndHalfNephews: 'optionNo',
                relationshipToDeceased: 'optionSibling'
            };
            const nextStepUrl = AnySurvivingHalfNiecesAndHalfNephews.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/applicant-name');
            done();
        });

        it('should return the correct url when deceased has all predeceased half-sibling and has surviving children for those predeceased', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                anyPredeceasedHalfSiblings: 'optionYesAll',
                anySurvivingHalfNiecesAndHalfNephews: 'optionYes',
                relationshipToDeceased: 'optionSibling'
            };
            const nextStepUrl = AnySurvivingHalfNiecesAndHalfNephews.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/half-nieces-half-nephews-age');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = AnySurvivingHalfNiecesAndHalfNephews.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'anySurvivingHalfNiecesAndHalfNephews', value: 'optionYes', choice: 'hadSurvivingHalfNiecesAndHalfNephews'},
                    {key: 'hadOtherHalfSiblingAndHadNoSurvivingHalfNiecesOrNephews', value: true, choice: 'hadOtherHalfSiblingAndHadNoSurvivingHalfNiecesOrNephews'},
                    {key: 'hadNoOtherHalfSiblingAndHadNoSurvivingHalfNiecesOrNephews', value: true, choice: 'hadNoOtherHalfSiblingAndHadNoSurvivingHalfNiecesOrNephews'},
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
                anySurvivingHalfNiecesAndHalfNephews: 'optionYes',
                allHalfNiecesAndHalfNephewsOver18: 'optionNo',
                allHalfSiblingsOver18: 'optionYes'
            };
            const formdata = {
                deceased: {
                    anySurvivingHalfNiecesAndHalfNephews: 'optionNo'
                }
            };

            AnySurvivingHalfNiecesAndHalfNephews.action(ctx, formdata);
            assert.isUndefined(ctx.allHalfNiecesAndHalfNephewsOver18);
        });
    });
});
