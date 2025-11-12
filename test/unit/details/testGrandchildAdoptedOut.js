'use strict';

const journey = require('app/journeys/intestacy');
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const GrandchildAdoptedOut = steps.GrandchildAdoptedOut;

describe('GrandchildAdoptedOut', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = GrandchildAdoptedOut.constructor.getUrl();
            expect(url).to.equal('/mainapplicantsparent-adopted-you-out');
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

            ctx = GrandchildAdoptedOut.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepUrl()', () => {

        it('should return the correct url when the grandchild is not adopted out', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                deceasedMaritalStatus: 'optionMarried',
                relationshipToDeceased: 'optionGrandchild',
                grandchildAdoptedOut: 'optionNo',
            };
            const nextStepUrl = GrandchildAdoptedOut.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/any-other-children');
            done();
        });

        it('should return the correct url when the grandchild is adopted out', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                deceasedMaritalStatus: 'optionMarried',
                relationshipToDeceased: 'optionGrandchild',
                grandchildAdoptedOut: 'optionYes',
            };
            const nextStepUrl = GrandchildAdoptedOut.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/adoptedOut');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = GrandchildAdoptedOut.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'grandchildAdoptedOut', value: 'optionNo', choice: 'grandchildNotAdoptedOut'}
                ]
            });
            done();
        });
    });
});
