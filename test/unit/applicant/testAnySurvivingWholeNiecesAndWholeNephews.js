'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const journey = require('app/journeys/intestacy');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const AnySurvivingWholeNiecesAndWholeNephews = steps.AnySurvivingWholeNiecesAndWholeNephews;

describe('AnySurvivingWholeNiecesAndWholeNephews', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AnySurvivingWholeNiecesAndWholeNephews.constructor.getUrl();
            expect(url).to.equal('/whole-siblings-surviving-children');
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

            const ctx = AnySurvivingWholeNiecesAndWholeNephews.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when deceased has some predeceased whole-siblings and has surviving children for those predeceased', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                anyPredeceasedWholeSiblings: 'optionYesSome',
                anySurvivingWholeNiecesAndWholeNephews: 'optionYes',
                relationshipToDeceased: 'optionSibling'
            };
            const nextStepUrl = AnySurvivingWholeNiecesAndWholeNephews.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/whole-nieces-whole-nephews-age');
            done();
        });

        it('should return the correct url when deceased has some predeceased whole-siblings and has no surviving children for those predeceased', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                anyPredeceasedWholeSiblings: 'optionYesSome',
                anySurvivingWholeNiecesAndWholeNephews: 'optionNo',
                relationshipToDeceased: 'optionSibling'
            };
            const nextStepUrl = AnySurvivingWholeNiecesAndWholeNephews.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/whole-siblings-age');
            done();
        });

        it('should return the correct url when deceased has all predeceased whole-siblings and has no surviving children for those predeceased', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                anyPredeceasedWholeSiblings: 'optionYesAll',
                anySurvivingWholeNiecesAndWholeNephews: 'optionNo',
                relationshipToDeceased: 'optionSibling'
            };
            const nextStepUrl = AnySurvivingWholeNiecesAndWholeNephews.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/applicant-name');
            done();
        });

        it('should return the correct url when deceased has all predeceased whole-sibling and has surviving children for those predeceased', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                anyPredeceasedWholeSiblings: 'optionYesAll',
                anySurvivingWholeNiecesAndWholeNephews: 'optionYes',
                relationshipToDeceased: 'optionSibling'
            };
            const nextStepUrl = AnySurvivingWholeNiecesAndWholeNephews.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/whole-nieces-whole-nephews-age');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = AnySurvivingWholeNiecesAndWholeNephews.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'anySurvivingWholeNiecesAndWholeNephews', value: 'optionYes', choice: 'hadSurvivingWholeNiecesAndWholeNephews'},
                    {key: 'hadOtherWholeSiblingAndHadNoSurvivingWholeNiecesOrNephews', value: true, choice: 'hadOtherWholeSiblingAndHadNoSurvivingWholeNiecesOrNephews'},
                    {key: 'hadNoOtherWholeSiblingAndHadNoSurvivingWholeNiecesOrNephews', value: true, choice: 'hadNoOtherWholeSiblingAndHadNoSurvivingWholeNiecesOrNephews'},
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
                anySurvivingWholeNiecesAndWholeNephews: 'optionYes',
                allWholeNiecesAndWholeNephewsOver18: 'optionNo',
                allWholeSiblingsOver18: 'optionYes'
            };
            const formdata = {
                deceased: {
                    anySurvivingWholeNiecesAndWholeNephews: 'optionNo'
                }
            };

            AnySurvivingWholeNiecesAndWholeNephews.action(ctx, formdata);
            assert.isUndefined(ctx.allWholeNiecesAndWholeNephewsOver18);
        });
    });
});
