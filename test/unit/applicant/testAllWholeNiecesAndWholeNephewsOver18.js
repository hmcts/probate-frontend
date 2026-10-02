'use strict';

const journey = require('app/journeys/intestacy');
const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const AllWholeNiecesAndWholeNephewsOver18 = steps.AllWholeNiecesAndWholeNephewsOver18;

describe('AllWholeNiecesAndWholeNephewsOver18', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AllWholeNiecesAndWholeNephewsOver18.constructor.getUrl();
            expect(url).to.equal('/whole-nieces-whole-nephews-age');
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

            const ctx = AllWholeNiecesAndWholeNephewsOver18.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url all niece and nephew are over 18 and all other predeceased siblings', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                allWholeNiecesAndWholeNephewsOver18: 'optionYes',
                anyPredeceasedWholeSiblings: 'optionYesAll'
            };
            const nextStepUrl = AllWholeNiecesAndWholeNephewsOver18.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/applicant-name');
            done();
        });

        it('should return the correct url when all niece and nephew are over 18 and has some predeceased Sibling', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                allWholeNiecesAndWholeNephewsOver18: 'optionYes',
                anyPredeceasedWholeSiblings: 'optionYesSome'
            };
            const nextStepUrl = AllWholeNiecesAndWholeNephewsOver18.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/whole-siblings-age');
            done();
        });

        it('should return the correct url when some children of whole-sibling are under 18', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                allWholeNiecesAndWholeNephewsOver18: 'optionNo'
            };
            const nextStepUrl = AllWholeNiecesAndWholeNephewsOver18.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/anyoneUnder18');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = AllWholeNiecesAndWholeNephewsOver18.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'allWholeNiecesAndWholeNephewsOver18AndSomePredeceasedWholeSiblings', value: true, choice: 'allWholeNiecesAndWholeNephewsOver18AndSomePredeceasedWholeSiblings'},
                    {key: 'allWholeNiecesAndWholeNephewsOver18AndAllPredeceasedWholeSiblings', value: true, choice: 'allWholeNiecesAndWholeNephewsOver18AndAllPredeceasedWholeSiblings'}
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
            AllWholeNiecesAndWholeNephewsOver18.action(ctx);
            assert.isUndefined(ctx.deceasedName);
        });
    });
});
