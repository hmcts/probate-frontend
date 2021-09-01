'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const DeceasedMaritalStatus = steps.DeceasedMaritalStatus;

describe('DeceasedMaritalStatus', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedMaritalStatus.constructor.getUrl();
            expect(url).to.equal('/deceased-marital-status*');
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

            ctx = DeceasedMaritalStatus.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {
                maritalStatus: 'optionMarried'
            };
            const nextStepOptions = DeceasedMaritalStatus.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'divorcedOrSeparated',
                    value: true,
                    choice: 'divorcedOrSeparated'
                }]
            });
            done();
        });
    });

    describe('action()', () => {
        it('test that context and session form variables are removed', () => {
            let formdata = {
                deceased: {
                    maritalStatus: 'optionDivorced'
                },
                applicant: {
                    relationshipToDeceased: 'optionSpousePartner',
                    spouseNotApplyingReason: 'optionRenouncing',
                    adoptionPlace: 'optionYes'
                }
            };
            let ctx = {
                maritalStatus: 'optionMarried',
                deceasedName: 'Dee Ceased',
                divorcedOrSeparated: true,
                divorcePlace: 'optionYes',
                anyChildren: 'optionYes',
                anyOtherChildren: 'optionYes',
                allChildrenOver18: 'optionYes',
                anyDeceasedChildren: 'optionYes',
                anyGrandchildrenUnder18: 'optionYes'
            };
            [ctx, formdata] = DeceasedMaritalStatus.action(ctx, formdata);
            expect([ctx, formdata]).to.deep.equal([
                {
                    maritalStatus: 'optionMarried'
                },
                {
                    deceased: {
                        maritalStatus: 'optionDivorced'
                    },
                    applicant: {}
                }
            ]);
        });
    });
});
