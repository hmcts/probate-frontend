'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const SameParents = steps.SameParents;

describe('SameParents', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = SameParents.constructor.getUrl();
            expect(url).to.equal('/deceased-same-parents');
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

            const ctx = SameParents.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;
        let formdata;
        const session = {};

        it('should remove existing sibling/niece/nephew coApplicants from index 1 in the list if any relationship changed', (done) => {
            ctx = {
                relationshipToDeceased: 'optionSibling',
                sameParents: 'optionOneParentsSame',
                list: [
                    {
                        fullName: 'Main Applicant', isApplicant: true
                    },
                    {
                        coApplicantRelationshipToDeceased: 'optionWholeSibling'
                    }
                ]
            };
            formdata = {
                applicant: {
                    sameParents: 'optionBothParentsSame',
                }
            };
            errors = [];
            [ctx, errors] = SameParents.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                relationshipToDeceased: 'optionSibling',
                sameParents: 'optionOneParentsSame',
                list: []
            });
            done();
        });
        it('should not change anything  if any relationship is not changed from CYA', (done) => {
            ctx = {
                relationshipToDeceased: 'optionSibling',
                sameParents: 'optionBothParentsSame',
                list: [
                    {
                        fullName: 'Main Applicant', isApplicant: true
                    },
                    {
                        coApplicantRelationshipToDeceased: 'optionWholeSibling'
                    }
                ]
            };
            formdata = {
                deceased: {
                    relationshipToDeceased: 'optionSibling',
                },
                applicant: {
                    sameParents: 'optionBothParentsSame',
                }
            };
            errors = [];
            [ctx, errors] = SameParents.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                relationshipToDeceased: 'optionSibling',
                sameParents: 'optionBothParentsSame',
                list: [
                    {
                        fullName: 'Main Applicant', isApplicant: true
                    },
                    {
                        coApplicantRelationshipToDeceased: 'optionWholeSibling'
                    }
                ]
            });
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = SameParents.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'wholeOrHalfBloodSibling', value: true, choice: 'wholeOrHalfBloodSibling'}
                ]
            });
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                deceasedName: 'Dee Ceased',
            };
            const formdata = {
                applicant: {
                    sameParents: 'optionBothParentsSame',
                }
            };

            SameParents.action(ctx, formdata);

            assert.isUndefined(ctx.deceasedName);
        });
    });
});
