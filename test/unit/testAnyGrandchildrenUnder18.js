'use strict';

const journey = require('app/journeys/intestacy');
const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const AnyGrandchildrenUnder18 = steps.AnyGrandchildrenUnder18;

describe('AnyGrandchildrenUnder18', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AnyGrandchildrenUnder18.constructor.getUrl();
            expect(url).to.equal('/any-grandchildren-under-18*');
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

            const ctx = AnyGrandchildrenUnder18.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when all grandchildren are over 18', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                anyGrandchildrenUnder18: 'optionNo'
            };
            const nextStepUrl = AnyGrandchildrenUnder18.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/applicant-name*');
            done();
        });

        it('should return the correct url when some grandchildren are under 18', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                anyGrandchildrenUnder18: 'optionYes'
            };
            const nextStepUrl = AnyGrandchildrenUnder18.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/grandchildrenUnder18');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = AnyGrandchildrenUnder18.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'anyGrandchildrenUnder18', value: 'optionNo', choice: 'allGrandchildrenOver18'},
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
            AnyGrandchildrenUnder18.action(ctx);
            assert.isUndefined(ctx.deceasedName);
        });
    });
});
