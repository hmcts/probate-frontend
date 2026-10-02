'use strict';

const journey = require('app/journeys/intestacy');
const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const GrandchildParentHasAllChildrenOver18 = steps.GrandchildParentHasAllChildrenOver18;

describe('GrandchildParentHasAllChildrenOver18', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = GrandchildParentHasAllChildrenOver18.constructor.getUrl();
            expect(url).to.equal('/all-grandchildren-over-18');
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

            const ctx = GrandchildParentHasAllChildrenOver18.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when all children are over 18', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                grandchildParentHasAllChildrenOver18: 'optionYes'
            };
            const nextStepUrl = GrandchildParentHasAllChildrenOver18.nextStepUrl(req, ctx);
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
                grandchildParentHasAllChildrenOver18: 'optionNo'
            };
            const nextStepUrl = GrandchildParentHasAllChildrenOver18.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/childrenUnder18');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = GrandchildParentHasAllChildrenOver18.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'grandchildParentHasAllChildrenOver18', value: 'optionYes', choice: 'allChildrenOver18'},
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
            GrandchildParentHasAllChildrenOver18.action(ctx);
            assert.isUndefined(ctx.deceasedName);
        });
    });
});
