'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const AnyPredeceasedChildren = steps.AnyPredeceasedChildren;

describe('AnyPredeceasedChildren', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AnyPredeceasedChildren.constructor.getUrl();
            expect(url).to.equal('/any-predeceased-children');
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

            const ctx = AnyPredeceasedChildren.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = AnyPredeceasedChildren.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'hadSomeOrAllPredeceasedChildren', value: true, choice: 'hadSomeOrAllPredeceasedChildren'},
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

        it('should remove existingGrandchild coApplicants from the list if predeceased children changed from yesSome to no', (done) => {
            ctx = {
                relationshipToDeceased: 'optionChild',
                anyPredeceasedChildren: 'optionNo',
                list: [
                    {
                        coApplicantRelationshipToDeceased: 'optionChild'
                    },
                    {
                        coApplicantRelationshipToDeceased: 'optionGrandchild'
                    }
                ]
            };
            formdata = {
                deceased: {
                    anyPredeceasedChildren: 'optionYesSome',
                }
            };
            errors = [];
            [ctx, errors] = AnyPredeceasedChildren.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                relationshipToDeceased: 'optionChild',
                anyPredeceasedChildren: 'optionNo',
                list: [
                    {
                        coApplicantRelationshipToDeceased: 'optionChild'
                    }
                ]
            });
            done();
        });
        it('should remove existing child coApplicants from the list if predeceased children changed from YesSome to YesAll', (done) => {
            ctx = {
                relationshipToDeceased: 'optionChild',
                anyPredeceasedChildren: 'optionYesAll',
                list: [
                    {
                        coApplicantRelationshipToDeceased: 'optionChild'
                    },
                    {
                        coApplicantRelationshipToDeceased: 'optionGrandchild'
                    }
                ]
            };
            formdata = {
                deceased: {
                    anyPredeceasedChildren: 'optionYesSome',
                }
            };
            errors = [];
            [ctx, errors] = AnyPredeceasedChildren.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                relationshipToDeceased: 'optionChild',
                anyPredeceasedChildren: 'optionYesAll',
                list: [
                    {
                        coApplicantRelationshipToDeceased: 'optionGrandchild'
                    }
                ]
            });
            done();
        });
        it('should not remove existing child/grandchild coApplicants from the list if predeceased children changed from YesAll to YesSome', (done) => {
            ctx = {
                relationshipToDeceased: 'optionChild',
                anyPredeceasedChildren: 'optionYesSome',
                list: [
                    {
                        coApplicantRelationshipToDeceased: 'optionGrandchild'
                    }
                ]
            };
            formdata = {
                deceased: {
                    anyPredeceasedChildren: 'optionYesAll',
                }
            };
            errors = [];
            [ctx, errors] = AnyPredeceasedChildren.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                relationshipToDeceased: 'optionChild',
                anyPredeceasedChildren: 'optionYesSome',
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
                deceasedName: 'Dee Ceased',
                anyPredeceasedChildren: 'optionNo',
                anyGrandchildrenUnder18: 'optionNo',
                allChildrenOver18: 'optionYes'
            };
            const formdata = {
                deceased: {
                    anyPredeceasedChildren: 'optionYesAll'
                }
            };

            AnyPredeceasedChildren.action(ctx, formdata);

            assert.isUndefined(ctx.deceasedName);
            assert.isUndefined(ctx.anyGrandchildrenUnder18);
            assert.isUndefined(ctx.allChildrenOver18);
        });
    });
});
