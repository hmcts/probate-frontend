'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const DeceasedMaritalStatus = steps.DeceasedMaritalStatus;
const content = require('app/resources/en/translation/deceased/maritalstatus');
const contentDivorcePlace = require('app/resources/en/translation/deceased/divorceplace');
const contentAnyChildren = require('app/resources/en/translation/deceased/anychildren');
const contentAnyOtherChildren = require('app/resources/en/translation/deceased/anyotherchildren');
const contentAllChildrenOver18 = require('app/resources/en/translation/deceased/allchildrenover18');
// const contentAnyDeceasedChildren = require('app/resources/en/translation/deceased/anydeceasedchildren');
// const contentAnyGrandchildrenUnder18 = require('app/resources/en/translation/deceased/anygrandchildrenunder18');
const contentRelationshipToDeceased = require('app/resources/en/translation/applicant/relationshiptodeceased');
const contentSpouseNotApplyingReason = require('app/resources/en/translation/applicant/spousenotapplyingreason');
const contentAdoptionPlace = require('app/resources/en/translation/applicant/adoptionplace');

describe('DeceasedMaritalStatus', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedMaritalStatus.constructor.getUrl();
            expect(url).to.equal('/deceased-marital-status');
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
                maritalStatus: content.optionMarried
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
                    maritalStatus: content.optionDivorced
                },
                applicant: {
                    relationshipToDeceased: contentRelationshipToDeceased.optionSpousePartner,
                    spouseNotApplyingReason: contentSpouseNotApplyingReason.optionRenouncing,
                    adoptionPlace: contentAdoptionPlace.optionYes
                }
            };
            let ctx = {
                maritalStatus: content.optionMarried,
                deceasedName: 'Dee Ceased',
                divorcedOrSeparated: true,
                divorcePlace: contentDivorcePlace.optionYes,
                anyChildren: contentAnyChildren.optionYes,
                anyOtherChildren: contentAnyOtherChildren.optionYes,
                allChildrenOver18: contentAllChildrenOver18.optionYes,
                // anyDeceasedChildren: contentAnyDeceasedChildren.optionYes,
                anyDeceasedChildren: 'Yes',
                // anyGrandchildrenUnder18: contentAnyGrandchildrenUnder18.optionYes
                anyGrandchildrenUnder18: 'Yes'
            };
            [ctx, formdata] = DeceasedMaritalStatus.action(ctx, formdata);
            expect([ctx, formdata]).to.deep.equal([
                {
                    maritalStatus: content.optionMarried
                },
                {
                    deceased: {
                        maritalStatus: content.optionDivorced
                    },
                    applicant: {}
                }
            ]);
        });
    });
});
