'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const journey = require('../../app/journeys/intestacy');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const AnySurvivingGrandchildren = steps.AnySurvivingGrandchildren;

describe('AnySurvivingGrandchildren', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AnySurvivingGrandchildren.constructor.getUrl();
            expect(url).to.equal('/any-surviving-grandchildren');
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

            const ctx = AnySurvivingGrandchildren.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when deceased has some predeceased children and has surviving children for those predeceased', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                anyPredeceasedChildren: 'optionYesSome',
                anySurvivingGrandchildren: 'optionYes',
                relationshipToDeceased: 'optionChild'
            };
            const nextStepUrl = AnySurvivingGrandchildren.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/any-grandchildren-under-18');
            done();
        });

        it('should return the correct url when deceased has some predeceased children and has no surviving children for those predeceased and relationship is child', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                anyPredeceasedChildren: 'optionYesSome',
                anySurvivingGrandchildren: 'optionNo',
                relationshipToDeceased: 'optionChild'
            };
            const nextStepUrl = AnySurvivingGrandchildren.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/all-children-over-18');
            done();
        });

        it('should return the correct url when deceased has all predeceased children and has no surviving children for those predeceased and relationship is child', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                anyPredeceasedChildren: 'optionYesAll',
                anySurvivingGrandchildren: 'optionNo',
                relationshipToDeceased: 'optionChild'
            };
            const nextStepUrl = AnySurvivingGrandchildren.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/applicant-name');
            done();
        });

        it('should return the correct url when deceased has all predeceased children and has no surviving children for those predeceased and relationship is grandchild', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                anyPredeceasedChildren: 'optionYesAll',
                anySurvivingGrandchildren: 'optionNo',
                relationshipToDeceased: 'optionGrandchild'
            };
            const nextStepUrl = AnySurvivingGrandchildren.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/mainapplicantsparent-any-other-children');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = AnySurvivingGrandchildren.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'anySurvivingGrandchildren', value: 'optionYes', choice: 'hadSurvivingGrandchildren'},
                    {key: 'hadOtherChildrenAndHadNoSurvivingGrandchildren', value: true, choice: 'hadOtherChildrenAndHadNoSurvivingGrandchildren'},
                    {key: 'childAndNoOtherChildrenAndHadNoSurvivingGrandchildren', value: true, choice: 'childAndNoOtherChildrenAndHadNoSurvivingGrandchildren'},
                    {key: 'grandchildAndNoSurvivingGrandchildrenOfOtherChildren', value: true, choice: 'grandchildAndNoSurvivingGrandchildrenOfOtherChildren'}
                ]
            });
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                deceasedName: 'Dee Ceased',
                anyPredeceasedChildren: 'optionYesSome',
                anySurvivingGrandchildren: 'optionYes',
                anyGrandchildrenUnder18: 'optionNo',
                allChildrenOver18: 'optionYes'
            };
            const formdata = {
                deceased: {
                    anySurvivingGrandchildren: 'optionNo'
                }
            };

            AnySurvivingGrandchildren.action(ctx, formdata);
            assert.isUndefined(ctx.anyGrandchildrenUnder18);
        });
    });
});
