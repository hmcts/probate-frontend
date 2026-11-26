'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const journey = require('../../app/journeys/intestacy');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const AnyOtherChildren = steps.AnyOtherChildren;

describe('AnyOtherChildren', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AnyOtherChildren.constructor.getUrl();
            expect(url).to.equal('/any-other-children');
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

            const ctx = AnyOtherChildren.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;
        let formdata;
        const session = {};

        it('should remove existing child/Grandchild coApplicants from index 1 in the list if any other children changed from yes to no', (done) => {
            ctx = {
                relationshipToDeceased: 'optionChild',
                anyOtherChildren: 'optionNo',
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
                    anyOtherChildren: 'optionYes',
                }
            };
            errors = [];
            [ctx, errors] = AnyOtherChildren.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                relationshipToDeceased: 'optionChild',
                anyOtherChildren: 'optionNo',
                list: [
                    {
                        fullName: 'Main Applicant', isApplicant: true
                    }
                ]
            });
            done();
        });
        it('should not change anything if any other children changed from no to yes', (done) => {
            ctx = {
                relationshipToDeceased: 'optionChild',
                anyOtherChildren: 'optionYes'
            };
            formdata = {
                deceased: {
                    anyOtherChildren: 'optionNo',
                }
            };
            errors = [];
            [ctx, errors] = AnyOtherChildren.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                relationshipToDeceased: 'optionChild',
                anyOtherChildren: 'optionYes',
            });
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = AnyOtherChildren.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'grandchildAndHadNoChildren', value: true, choice: 'grandchildAndHadNoChildren'},
                    {key: 'anyOtherChildren', value: 'optionYes', choice: 'hadOtherChildren'},
                ]
            });
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when deceased has other children', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                anyOtherChildren: 'optionYes',
                relationshipToDeceased: 'optionChild'
            };
            const nextStepUrl = AnyOtherChildren.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/any-predeceased-children');
            done();
        });

        it('should return the correct url when deceased has other children and relationship is child', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                anyOtherChildren: 'optionNo',
                relationshipToDeceased: 'optionChild'
            };
            const nextStepUrl = AnyOtherChildren.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/applicant-name');
            done();
        });

        it('should return the correct url deceased has other children and relationship is grandchild', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                anyOtherChildren: 'optionNo',
                relationshipToDeceased: 'optionGrandchild'
            };
            const nextStepUrl = AnyOtherChildren.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/mainapplicantsparent-any-other-children');
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                anyOtherChildren: 'optionNo',
                allChildrenOver18: 'optionYes',
                anyPredeceasedChildren: 'optionYesAll',
                anyGrandchildrenUnder18: 'optionNo'
            };
            const formdata = {
                deceased: {
                    anyOtherChildren: 'optionYes'
                }
            };

            AnyOtherChildren.action(ctx, formdata);

            assert.isUndefined(ctx.allChildrenOver18);
            assert.isUndefined(ctx.anyPredeceasedChildren);
            assert.isUndefined(ctx.anyGrandchildrenUnder18);
        });
    });
});
