'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const journey = require('app/journeys/intestacy');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const AnyOtherHalfSiblings = steps.AnyOtherHalfSiblings;

describe('AnyOtherHalfSiblings', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AnyOtherHalfSiblings.constructor.getUrl();
            expect(url).to.equal('/deceased-other-half-siblings');
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

            const ctx = AnyOtherHalfSiblings.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;
        let formdata;
        const session = {};

        it('should remove existing half sibling/niece/nephew coApplicants from index 1 in the list if any other half-sibling changed from yes to no', (done) => {
            ctx = {
                relationshipToDeceased: 'optionSibling',
                sameParents: 'optionOneParentsSame',
                anyOtherHalfSiblings: 'optionNo',
                list: [
                    {
                        fullName: 'Main Applicant', isApplicant: true
                    },
                    {
                        coApplicantRelationshipToDeceased: 'optionHalfSibling'
                    }
                ]
            };
            formdata = {
                applicant: {
                    anyOtherHalfSiblings: 'optionYes',
                }
            };
            errors = [];
            [ctx, errors] = AnyOtherHalfSiblings.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                relationshipToDeceased: 'optionSibling',
                sameParents: 'optionOneParentsSame',
                anyOtherHalfSiblings: 'optionNo',
                list: [
                    {
                        fullName: 'Main Applicant', isApplicant: true
                    }
                ]
            });
            done();
        });
        it('should not change anything if any other half-sibling changed from no to yes', (done) => {
            ctx = {
                relationshipToDeceased: 'optionSibling',
                sameParents: 'optionOneParentsSame',
                anyOtherHalfSiblings: 'optionYes',
                list: [
                    {
                        fullName: 'Main Applicant', isApplicant: true
                    },
                    {
                        coApplicantRelationshipToDeceased: 'optionHalfSibling'
                    }
                ]
            };
            formdata = {
                deceased: {
                    anyOtherHalfSiblings: 'optionNo',
                }
            };
            errors = [];
            [ctx, errors] = AnyOtherHalfSiblings.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                relationshipToDeceased: 'optionSibling',
                sameParents: 'optionOneParentsSame',
                anyOtherHalfSiblings: 'optionYes',
                list: [
                    {
                        fullName: 'Main Applicant', isApplicant: true
                    },
                    {
                        coApplicantRelationshipToDeceased: 'optionHalfSibling'
                    }
                ]
            });
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = AnyOtherHalfSiblings.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'anyOtherHalfSiblings', value: 'optionYes', choice: 'hadOtherOtherHalfSiblings'}
                ]
            });
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when deceased has other half-siblings', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                anyOtherHalfSiblings: 'optionYes',
                relationshipToDeceased: 'optionSibling'
            };
            const nextStepUrl = AnyOtherHalfSiblings.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/deceased-half-siblings');
            done();
        });
        it('should return the correct url deceased has no other half-siblings', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                anyOtherHalfSiblings: 'optionNo',
                relationshipToDeceased: 'optionSibling'
            };
            const nextStepUrl = AnyOtherHalfSiblings.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/applicant-name');
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                anyOtherHalfSiblings: 'optionNo',
                anyPredeceasedHalfSiblings: 'optionYesSome',
                anySurvivingHalfNiecesAndHalfNephews: 'optionYes',
                allHalfNiecesAndHalfNephewsOver18: 'optionYes',
                allHalfSiblingsOver18: 'optionYes'
            };
            const formdata = {
                applicant: {
                    anyOtherHalfSiblings: 'optionYes'
                }
            };

            AnyOtherHalfSiblings.action(ctx, formdata);

            assert.isUndefined(ctx.allHalfSiblingsOver18);
            assert.isUndefined(ctx.anyPredeceasedHalfSiblings);
            assert.isUndefined(ctx.allHalfNiecesAndHalfNephewsOver18);
        });
    });
});
