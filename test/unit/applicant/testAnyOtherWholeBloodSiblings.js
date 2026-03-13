'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const journey = require('app/journeys/intestacy');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const AnyOtherWholeSiblings = steps.AnyOtherWholeSiblings;

describe('AnyOtherWholeSiblings', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AnyOtherWholeSiblings.constructor.getUrl();
            expect(url).to.equal('/deceased-other-whole-siblings');
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

            const ctx = AnyOtherWholeSiblings.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('handlePost()', () => {
        let ctx;
        let errors;
        let formdata;
        const session = {};

        it('should remove existing whole sibling/niece/nephew coApplicants from index 1 in the list if any other whole-sibling changed from yes to no', (done) => {
            ctx = {
                relationshipToDeceased: 'optionSibling',
                sameParents: 'optionBothParentsSame',
                anyOtherWholeSiblings: 'optionNo',
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
                    anyOtherWholeSiblings: 'optionYes',
                }
            };
            errors = [];
            [ctx, errors] = AnyOtherWholeSiblings.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                relationshipToDeceased: 'optionSibling',
                sameParents: 'optionBothParentsSame',
                anyOtherWholeSiblings: 'optionNo',
                list: [
                    {
                        fullName: 'Main Applicant', isApplicant: true
                    }
                ]
            });
            done();
        });
        it('should not change anything if any other whole-sibling changed from no to yes', (done) => {
            ctx = {
                relationshipToDeceased: 'optionSibling',
                sameParents: 'optionBothParentsSame',
                anyOtherWholeSiblings: 'optionYes',
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
                    anyOtherWholeSiblings: 'optionNo',
                }
            };
            errors = [];
            [ctx, errors] = AnyOtherWholeSiblings.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                relationshipToDeceased: 'optionSibling',
                sameParents: 'optionBothParentsSame',
                anyOtherWholeSiblings: 'optionYes',
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
            const nextStepOptions = AnyOtherWholeSiblings.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'anyOtherWholeSiblings', value: 'optionYes', choice: 'hadOtherWholeSiblings'},
                    {key: 'hadOneParentSameAndHadNoWholeSiblings', value: true, choice: 'hadOneParentSameAndHadNoWholeSiblings'}
                ]
            });
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when deceased has other siblings', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                anyOtherWholeSiblings: 'optionYes',
                relationshipToDeceased: 'optionSibling'
            };
            const nextStepUrl = AnyOtherWholeSiblings.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/deceased-whole-siblings');
            done();
        });
        it('should return the correct url deceased has no other siblings', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                anyOtherWholeSiblings: 'optionNo',
                relationshipToDeceased: 'optionSibling'
            };
            const nextStepUrl = AnyOtherWholeSiblings.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/applicant-name');
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                anyOtherWholeSiblings: 'optionNo',
                anyPredeceasedWholeSiblings: 'optionYesSome',
                anySurvivingWholeNiecesAndWholeNephews: 'optionYes',
                allWholeNiecesAndWholeNephewsOver18: 'optionYes',
                allWholeSiblingsOver18: 'optionYes'
            };
            const formdata = {
                applicant: {
                    anyOtherWholeSiblings: 'optionYes'
                }
            };

            AnyOtherWholeSiblings.action(ctx, formdata);

            assert.isUndefined(ctx.allWholeSiblingsOver18);
            assert.isUndefined(ctx.anyPredeceasedWholeSiblings);
            assert.isUndefined(ctx.allWholeNiecesAndWholeNephewsOver18);
        });
    });
});
