'use strict';

const journey = require('app/journeys/intestacy');
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ParentAdoptedOut = steps.ParentAdoptedOut;

describe('ApplicantParentAdoptedOut', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ParentAdoptedOut.constructor.getUrl();
            expect(url).to.equal('/mainapplicantsparent-adopted-out');
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

            ctx = ParentAdoptedOut.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepUrl()', () => {

        it('should return the correct url when the grandchild parent is not adopted out', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                deceasedMaritalStatus: 'optionMarried',
                relationshipToDeceased: 'optionGrandchild',
                parentAdoptedOut: 'optionNo',
            };
            const nextStepUrl = ParentAdoptedOut.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/adopted-in');
            done();
        });

        it('should return the correct url when the grandchild parent is adopted out', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                deceasedMaritalStatus: 'optionMarried',
                relationshipToDeceased: 'optionGrandchild',
                parentAdoptedOut: 'optionYes',
            };
            const nextStepUrl = ParentAdoptedOut.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/grandchildParentAdoptedOut');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = ParentAdoptedOut.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'parentAdoptedOut', value: 'optionNo', choice: 'parentNotAdoptedOut'},
                ]
            });
            done();
        });
    });
});
