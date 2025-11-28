'use strict';

const journey = require('app/journeys/intestacy');
const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const AllHalfNiecesAndHalfNephewsOver18 = steps.AllHalfNiecesAndHalfNephewsOver18;

describe('AllHalfNiecesAndHalfNephewsOver18', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AllHalfNiecesAndHalfNephewsOver18.constructor.getUrl();
            expect(url).to.equal('/half-nieces-half-nephews-age');
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

            const ctx = AllHalfNiecesAndHalfNephewsOver18.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url all half-niece and half-nephew are over 18 and all other predeceased siblings', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                allHalfNiecesAndHalfNephewsOver18: 'optionYes',
                anyPredeceasedHalfSiblings: 'optionYesAll'
            };
            const nextStepUrl = AllHalfNiecesAndHalfNephewsOver18.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/applicant-name');
            done();
        });

        it('should return the correct url when all half-niece and half-nephew are over 18 and has some predeceased Sibling', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                allHalfNiecesAndHalfNephewsOver18: 'optionYes',
                anyPredeceasedHalfSiblings: 'optionYesSome'
            };
            const nextStepUrl = AllHalfNiecesAndHalfNephewsOver18.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/half-siblings-age');
            done();
        });

        it('should return the correct url when some children of half-sibling are under 18', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                allHalfNiecesAndHalfNephewsOver18: 'optionNo'
            };
            const nextStepUrl = AllHalfNiecesAndHalfNephewsOver18.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/anyoneUnder18');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = AllHalfNiecesAndHalfNephewsOver18.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'allHalfNiecesAndHalfNephewsOver18AndSomePredeceasedHalfSiblings', value: true, choice: 'allHalfNiecesAndHalfNephewsOver18AndSomePredeceasedHalfSiblings'},
                    {key: 'allHalfNiecesAndHalfNephewsOver18AndAllPredeceasedHalfSiblings', value: true, choice: 'allHalfNiecesAndHalfNephewsOver18AndAllPredeceasedHalfSiblings'}
                ]
            });
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                deceasedName: 'Dee Ceased'
            };
            AllHalfNiecesAndHalfNephewsOver18.action(ctx);
            assert.isUndefined(ctx.deceasedName);
        });
    });
});
