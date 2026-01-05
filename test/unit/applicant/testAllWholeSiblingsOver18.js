'use strict';

const journey = require('app/journeys/intestacy');
const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const AllWholeSiblingsOver18 = steps.AllWholeSiblingsOver18;

describe('AllWholeSiblingsOver18', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AllWholeSiblingsOver18.constructor.getUrl();
            expect(url).to.equal('/whole-siblings-age');
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

            const ctx = AllWholeSiblingsOver18.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when all siblings children are over 18', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                allWholeSiblingsOver18: 'optionYes',
                relationshipToDeceased: 'optionSibling'
            };
            const nextStepUrl = AllWholeSiblingsOver18.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/applicant-name');
            done();
        });

        it('should return the correct url when some children are under 18', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                allWholeSiblingsOver18: 'optionNo',
                relationshipToDeceased: 'optionChild'
            };
            const nextStepUrl = AllWholeSiblingsOver18.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/anyoneUnder18');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = AllWholeSiblingsOver18.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'allWholeSiblingsOver18', value: 'optionYes', choice: 'allWholeSiblingsOver18'}
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
            AllWholeSiblingsOver18.action(ctx);
            assert.isUndefined(ctx.deceasedName);
        });
    });
});
