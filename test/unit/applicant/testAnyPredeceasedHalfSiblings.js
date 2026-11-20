'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const AnyPredeceasedHalfSiblings = steps.AnyPredeceasedHalfSiblings;

describe('AnyPredeceasedHalfSiblings', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AnyPredeceasedHalfSiblings.constructor.getUrl();
            expect(url).to.equal('/deceased-half-siblings');
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

            const ctx = AnyPredeceasedHalfSiblings.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;
        let formdata;
        const session = {};

        it('should remove existing half niece/nephew coApplicants from the list if predeceased half-sibling changed from yesSome to no', (done) => {
            ctx = {
                relationshipToDeceased: 'optionSibling',
                anyPredeceasedHalfSiblings: 'optionNo',
                list: [
                    {
                        coApplicantRelationshipToDeceased: 'optionHalfBloodSibling'
                    },
                    {
                        coApplicantRelationshipToDeceased: 'optionHalfBloodNieceOrNephew'
                    }
                ]
            };
            formdata = {
                applicant: {
                    anyPredeceasedHalfSiblings: 'optionYesSome',
                }
            };
            errors = [];
            [ctx, errors] = AnyPredeceasedHalfSiblings.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                relationshipToDeceased: 'optionSibling',
                anyPredeceasedHalfSiblings: 'optionNo',
                list: [
                    {
                        coApplicantRelationshipToDeceased: 'optionHalfBloodSibling'
                    }
                ]
            });
            done();
        });
        it('should remove existing half-sibling coApplicants from the list if predeceased half-sibling changed from YesSome to YesAll', (done) => {
            ctx = {
                relationshipToDeceased: 'optionSibling',
                anyPredeceasedHalfSiblings: 'optionYesAll',
                list: [
                    {
                        coApplicantRelationshipToDeceased: 'optionHalfBloodSibling'
                    },
                    {
                        coApplicantRelationshipToDeceased: 'optionHalfBloodNieceOrNephew'
                    }
                ]
            };
            formdata = {
                applicant: {
                    anyPredeceasedHalfSiblings: 'optionYesSome',
                }
            };
            errors = [];
            [ctx, errors] = AnyPredeceasedHalfSiblings.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                relationshipToDeceased: 'optionSibling',
                anyPredeceasedHalfSiblings: 'optionYesAll',
                list: [
                    {
                        coApplicantRelationshipToDeceased: 'optionHalfBloodNieceOrNephew'
                    }
                ]
            });
            done();
        });
        it('should not remove existing half sibling/niece/nephew coApplicants from the list if predeceased half-sibling changed from YesAll to YesSome', (done) => {
            ctx = {
                relationshipToDeceased: 'optionSibling',
                anyPredeceasedHalfSiblings: 'optionYesSome',
                list: [
                    {
                        coApplicantRelationshipToDeceased: 'optionHalfBloodNieceOrNephew'
                    }
                ]
            };
            formdata = {
                applicant: {
                    anyPredeceasedHalfSiblings: 'optionYesAll',
                }
            };
            errors = [];
            [ctx, errors] = AnyPredeceasedHalfSiblings.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                relationshipToDeceased: 'optionSibling',
                anyPredeceasedHalfSiblings: 'optionYesSome',
                list: [
                    {
                        coApplicantRelationshipToDeceased: 'optionHalfBloodNieceOrNephew'
                    }
                ]
            });
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = AnyPredeceasedHalfSiblings.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'hadSomeOrAllPredeceasedHalfSibling', value: true, choice: 'hadSomeOrAllPredeceasedHalfSibling'},
                ]
            });
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                deceasedName: 'Dee Ceased',
                anyPredeceasedHalfSiblings: 'optionYesSome',
                allHalfNiecesAndHalfNephewsOver18: 'optionYes',
                allHalfSiblingsOver18: 'optionYes'
            };
            const formdata = {
                applicant: {
                    anyPredeceasedHalfSiblings: 'optionYesAll'
                }
            };

            AnyPredeceasedHalfSiblings.action(ctx, formdata);

            assert.isUndefined(ctx.deceasedName);
            assert.isUndefined(ctx.allHalfNiecesAndHalfNephewsOver18);
            assert.isUndefined(ctx.allHalfSiblingsOver18);
        });
    });
});
