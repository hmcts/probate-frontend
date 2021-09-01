'use strict';

const journey = require('app/journeys/intestacy');
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const SpouseNotApplyingReason = steps.SpouseNotApplyingReason;

describe('SpouseNotApplyingReason', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = SpouseNotApplyingReason.constructor.getUrl();
            expect(url).to.equal('/spouse-not-applying-reason*');
            done();
        });
    });

    describe('getContextData()', () => {
        let ctx;
        let req;

        it('should return the context with the deceased name', (done) => {
            req = {
                session: {
                    form: {
                        deceased: {
                            firstName: 'John',
                            lastName: 'Doe'
                        }
                    }
                }
            };

            ctx = SpouseNotApplyingReason.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when Renouncing is given', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                spouseNotApplyingReason: 'optionRenouncing'
            };
            const nextStepUrl = SpouseNotApplyingReason.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/any-other-children');
            done();
        });

        it('should return the correct url when Other is given', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                spouseNotApplyingReason: 'optionOther'
            };
            const nextStepUrl = SpouseNotApplyingReason.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/spouseNotApplying');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = SpouseNotApplyingReason.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'spouseNotApplyingReason',
                    value: 'optionRenouncing',
                    choice: 'renouncing'
                }]
            });
            done();
        });
    });
});
