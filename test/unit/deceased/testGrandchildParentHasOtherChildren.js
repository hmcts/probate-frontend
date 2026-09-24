'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const GrandchildParentHasOtherChildren = steps.GrandchildParentHasOtherChildren;

describe('GrandchildParentHasOtherChildren', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = GrandchildParentHasOtherChildren.constructor.getUrl();
            expect(url).to.equal('/mainapplicantsparent-any-other-children');
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

            const ctx = GrandchildParentHasOtherChildren.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = GrandchildParentHasOtherChildren.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'grandchildParentHasOtherChildren', value: 'optionYes', choice: 'grandchildParentHasOtherChildren'},
                ]
            });
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;
        let formdata;
        const session = {};

        it('should remove existingGrandchild coApplicants from the list if parent has other children changed from yes to no', (done) => {
            ctx = {
                relationshipToDeceased: 'optionGrandchild',
                grandchildParentHasOtherChildren: 'optionNo',
                list: [
                    {
                        fullName: 'Main Applicant', isApplicant: true
                    },
                    {
                        coApplicantRelationshipToDeceased: 'optionGrandchild'
                    }
                ]
            };
            formdata = {
                deceased: {
                    anyPredeceasedChildren: 'optionYesSome',
                    grandchildParentHasOtherChildren: 'optionYes',
                }
            };
            errors = [];
            [ctx, errors] = GrandchildParentHasOtherChildren.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                relationshipToDeceased: 'optionGrandchild',
                grandchildParentHasOtherChildren: 'optionNo',
                list: [
                    {
                        fullName: 'Main Applicant', isApplicant: true
                    }
                ]
            });
            done();
        });
        it('should not remove existing child/grandchild coApplicants from the list if grandchild parent changed from no to yes', (done) => {
            ctx = {
                relationshipToDeceased: 'optionChild',
                grandchildParentHasOtherChildren: 'optionYes',
                list: [
                    {
                        coApplicantRelationshipToDeceased: 'optionGrandchild'
                    }
                ]
            };
            formdata = {
                deceased: {
                    anyPredeceasedChildren: 'optionYesSome',
                    grandchildParentHasOtherChildren: 'optionNo',
                }
            };
            errors = [];
            [ctx, errors] = GrandchildParentHasOtherChildren.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                relationshipToDeceased: 'optionChild',
                grandchildParentHasOtherChildren: 'optionYes',
                list: [
                    {
                        coApplicantRelationshipToDeceased: 'optionGrandchild'
                    }
                ]
            });
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                grandchildParentHasOtherChildren: 'optionYes',
                grandchildParentHasAllChildrenOver18: 'optionYes',
            };
            const formdata = {
                deceased: {
                    grandchildParentHasOtherChildren: 'optionNo'
                }
            };

            GrandchildParentHasOtherChildren.action(ctx, formdata);

            assert.isUndefined(ctx.grandchildParentHasAllChildrenOver18);
        });
    });
});
