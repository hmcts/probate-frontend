'use strict';

const journey = require('app/journeys/intestacy');
const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const RelationshipToDeceased = steps.RelationshipToDeceased;

describe('RelationshipToDeceased', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = RelationshipToDeceased.constructor.getUrl();
            expect(url).to.equal('/relationship-to-deceased');
            done();
        });
    });

    describe('getContextData()', () => {
        let ctx;
        let req;

        it('should return the context with the deceased marital status and the estate value', (done) => {
            req = {
                session: {
                    form: {
                        deceased: {
                            maritalStatus: 'optionMarried'
                        },
                        iht: {
                            netValue: 350000
                        }
                    }
                }
            };

            ctx = RelationshipToDeceased.getContextData(req);
            expect(ctx.deceasedMaritalStatus).to.equal('optionMarried');
            expect(ctx.assetsValue).to.equal(350000);
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when relationship is Child and the deceased was married', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                relationshipToDeceased: 'optionChild',
                deceasedMaritalStatus: 'optionMarried'
            };
            const nextStepUrl = RelationshipToDeceased.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/spouse-not-applying-reason');
            done();
        });

        it('should return the correct url when relationship is Child and the deceased was not married', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                relationshipToDeceased: 'optionChild',
                deceasedMaritalStatus: 'optionNotMarried'
            };
            const nextStepUrl = RelationshipToDeceased.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/any-other-children');
            done();
        });

        it('should return the correct url when relationship is Adopted Child', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                relationshipToDeceased: 'optionAdoptedChild'
            };
            const nextStepUrl = RelationshipToDeceased.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/adoption-place');
            done();
        });

        it('should return the correct url when relationship is Spouse/Partner and estate value is <= £250k', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                relationshipToDeceased: 'optionSpousePartner',
                assetsValue: 200000
            };
            const nextStepUrl = RelationshipToDeceased.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/applicant-name');
            done();
        });

        it('should return the correct url when relationship is Spouse/Partner and estate value is > £250k', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                relationshipToDeceased: 'optionSpousePartner',
                assetsValue: 450000
            };
            const nextStepUrl = RelationshipToDeceased.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/any-children');
            done();
        });

        it('should return the correct url when Other is given', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                relationshipToDeceased: 'optionOther'
            };
            const nextStepUrl = RelationshipToDeceased.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/otherRelationship');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = RelationshipToDeceased.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'spousePartnerLessThan250k', value: true, choice: 'spousePartnerLessThan250k'},
                    {key: 'spousePartnerMoreThan250k', value: true, choice: 'spousePartnerMoreThan250k'},
                    {key: 'childDeceasedMarried', value: true, choice: 'childDeceasedMarried'},
                    {key: 'childDeceasedNotMarried', value: true, choice: 'childDeceasedNotMarried'},
                    {key: 'relationshipToDeceased', value: 'optionAdoptedChild', choice: 'adoptedChild'},
                ]
            });
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context and formdata', () => {
            const ctx = {
                assetsValue: 450000,
                spousePartnerLessThan250k: true,
                spousePartnerMoreThan250k: true,
                childDeceasedMarried: true,
                childDeceasedNotMarried: true,

                relationshipToDeceased: 'optionChild',
                adoptionPlace: 'optionYes',
                spouseNotApplyingReason: 'optionRenouncing'
            };
            const formdata = {
                applicant: {
                    relationshipToDeceased: 'optionAdoptedChild',
                },
                deceased: {
                    anyChildren: 'optionYes',
                    anyOtherChildren: 'optionYes',
                    allChildrenOver18: 'optionYes',
                    anyDeceasedChildren: 'optionYes',
                    anyGrandchildrenUnder18: 'optionNo'
                }
            };

            RelationshipToDeceased.action(ctx, formdata);

            assert.isUndefined(ctx.assetsValue);
            assert.isUndefined(ctx.spousePartnerLessThan250k);
            assert.isUndefined(ctx.spousePartnerMoreThan250k);
            assert.isUndefined(ctx.childDeceasedMarried);
            assert.isUndefined(ctx.childDeceasedNotMarried);

            assert.isUndefined(ctx.adoptionPlace);
            assert.isUndefined(ctx.spouseNotApplyingReason);

            assert.isUndefined(formdata.deceased.anyChildren);
            assert.isUndefined(formdata.deceased.anyOtherChildren);
            assert.isUndefined(formdata.deceased.allChildrenOver18);
            assert.isUndefined(formdata.deceased.anyDeceasedChildren);
            assert.isUndefined(formdata.deceased.anyGrandchildrenUnder18);
        });
    });
});
