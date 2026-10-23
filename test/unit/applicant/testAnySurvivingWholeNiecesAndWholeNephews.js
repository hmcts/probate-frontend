'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const journey = require('app/journeys/intestacy');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const AnySurvivingWholeNiecesAndWholeNephews = steps.AnySurvivingWholeNiecesAndWholeNephews;

describe('AnySurvivingWholeNiecesAndWholeNephews', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AnySurvivingWholeNiecesAndWholeNephews.constructor.getUrl();
            expect(url).to.equal('/whole-siblings-surviving-children');
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

            const ctx = AnySurvivingWholeNiecesAndWholeNephews.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });
    describe('handlePost()', () => {
        let ctx;
        let errors;
        let formdata;
        const session = {};

        it('should remove existing whole niece/nephew coApplicants from the list if surviving niece/nephew changed from yes to no', (done) => {
            ctx = {
                relationshipToDeceased: 'optionSibling',
                anySurvivingWholeNiecesAndWholeNephews: 'optionNo',
                list: [
                    {
                        coApplicantRelationshipToDeceased: 'optionWholeBloodSibling'
                    },
                    {
                        coApplicantRelationshipToDeceased: 'optionWholeBloodNieceOrNephew'
                    }
                ]
            };
            formdata = {
                applicant: {
                    anyPredeceasedWholeSiblings: 'optionYesSome',
                    anySurvivingWholeNiecesAndWholeNephews: 'optionYes',
                }
            };
            errors = [];
            [ctx, errors] = AnySurvivingWholeNiecesAndWholeNephews.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                relationshipToDeceased: 'optionSibling',
                anySurvivingWholeNiecesAndWholeNephews: 'optionNo',
                list: [
                    {
                        coApplicantRelationshipToDeceased: 'optionWholeBloodSibling'
                    }
                ]
            });
            done();
        });
        it('should remove All coApplicants from the index 1 in the list if surviving children changed from yes to no', (done) => {
            ctx = {
                relationshipToDeceased: 'optionSibling',
                anySurvivingWholeNiecesAndWholeNephews: 'optionNo',
                list: [
                    {
                        fullName: 'Child One', isApplicant: true
                    },
                    {
                        coApplicantRelationshipToDeceased: 'optionWholeBloodNieceOrNephew'
                    }
                ]
            };
            formdata = {
                applicant: {
                    anyPredeceasedWholeSiblings: 'optionYesAll',
                    anySurvivingWholeNiecesAndWholeNephews: 'optionYes',
                }
            };
            errors = [];
            [ctx, errors] = AnySurvivingWholeNiecesAndWholeNephews.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                relationshipToDeceased: 'optionSibling',
                anySurvivingWholeNiecesAndWholeNephews: 'optionNo',
                list: [
                    {
                        fullName: 'Child One', isApplicant: true
                    }
                ]
            });
            done();
        });
        it('should not remove existing sibling/nephew/niece coApplicants from the list if surviving children changed from no to yes', (done) => {
            ctx = {
                relationshipToDeceased: 'optionSibling',
                anySurvivingWholeNiecesAndWholeNephews: 'optionYes',
                list: [
                    {
                        coApplicantRelationshipToDeceased: 'optionWholeBloodNieceOrNephew'
                    }
                ]
            };
            formdata = {
                applicant: {
                    anyPredeceasedWholeSiblings: 'optionYesSome',
                    anySurvivingWholeNiecesAndWholeNephews: 'optionNo',
                }
            };
            errors = [];
            [ctx, errors] = AnySurvivingWholeNiecesAndWholeNephews.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                relationshipToDeceased: 'optionSibling',
                anySurvivingWholeNiecesAndWholeNephews: 'optionYes',
                list: [
                    {
                        coApplicantRelationshipToDeceased: 'optionWholeBloodNieceOrNephew'
                    }
                ]
            });
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when deceased has some predeceased whole-siblings and has surviving children for those predeceased', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                anyPredeceasedWholeSiblings: 'optionYesSome',
                anySurvivingWholeNiecesAndWholeNephews: 'optionYes',
                relationshipToDeceased: 'optionSibling',
                sameParents: 'optionBothParentsSame'
            };
            const nextStepUrl = AnySurvivingWholeNiecesAndWholeNephews.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/whole-nieces-whole-nephews-age');
            done();
        });

        it('should return the correct url when deceased has some predeceased whole-siblings and has no surviving children for those predeceased', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                anyPredeceasedWholeSiblings: 'optionYesSome',
                anySurvivingWholeNiecesAndWholeNephews: 'optionNo',
                relationshipToDeceased: 'optionSibling',
                sameParents: 'optionBothParentsSame'
            };
            const nextStepUrl = AnySurvivingWholeNiecesAndWholeNephews.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/whole-siblings-age');
            done();
        });

        it('should return the correct url when deceased has all predeceased whole-siblings and has no surviving children for those predeceased', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                anyPredeceasedWholeSiblings: 'optionYesAll',
                anySurvivingWholeNiecesAndWholeNephews: 'optionNo',
                relationshipToDeceased: 'optionSibling',
                sameParents: 'optionBothParentsSame'
            };
            const nextStepUrl = AnySurvivingWholeNiecesAndWholeNephews.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/applicant-name');
            done();
        });

        it('should return the correct url when deceased has all predeceased whole-sibling and has surviving children for those predeceased', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                anyPredeceasedWholeSiblings: 'optionYesAll',
                anySurvivingWholeNiecesAndWholeNephews: 'optionYes',
                relationshipToDeceased: 'optionSibling',
                sameParents: 'optionBothParentsSame'
            };
            const nextStepUrl = AnySurvivingWholeNiecesAndWholeNephews.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/whole-nieces-whole-nephews-age');
            done();
        });

        it('should return the correct url when deceased has all predeceased whole-sibling and has surviving children for those predeceased', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                anyPredeceasedWholeSiblings: 'optionYesAll',
                anySurvivingWholeNiecesAndWholeNephews: 'optionNo',
                relationshipToDeceased: 'optionSibling',
                sameParents: 'optionOneParentsSame'
            };
            const nextStepUrl = AnySurvivingWholeNiecesAndWholeNephews.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/deceased-other-half-siblings');
            done();
        });

        it('should return the correct url when deceased has all predeceased whole-sibling and has surviving children for those predeceased', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                anyPredeceasedWholeSiblings: 'optionYesAll',
                anySurvivingWholeNiecesAndWholeNephews: 'optionYes',
                relationshipToDeceased: 'optionSibling',
                sameParents: 'optionOneParentsSame'
            };
            const nextStepUrl = AnySurvivingWholeNiecesAndWholeNephews.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/hasSurvivingChildrenWithOneParent');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = AnySurvivingWholeNiecesAndWholeNephews.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'hasBothParentsSameAndHasSurvivors', value: true, choice: 'hasBothParentsSameAndHasSurvivors'},
                    {key: 'hasBothParentsSameAndHadOtherWholeSiblingAndHadNoSurvivors', value: true, choice: 'hasBothParentsSameAndHadOtherWholeSiblingAndHadNoSurvivors'},
                    {key: 'hasBothParentsSameAndHadNoOtherWholeSiblingAndHadNoSurvivors', value: true, choice: 'hasBothParentsSameAndHadNoOtherWholeSiblingAndHadNoSurvivors'},
                    {key: 'hasOneParentsSameAndHadAllPredeceasedWholeSiblingAndNoSurvivors', value: true, choice: 'hasOneParentsSameAndHadAllPredeceasedWholeSiblingAndNoSurvivors'}
                ]
            });
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                deceasedName: 'Dee Ceased',
                anyPredeceasedWholeSiblings: 'optionYesSome',
                anySurvivingWholeNiecesAndWholeNephews: 'optionYes',
                allWholeNiecesAndWholeNephewsOver18: 'optionNo',
                allWholeSiblingsOver18: 'optionYes'
            };
            const formdata = {
                applicant: {
                    anySurvivingWholeNiecesAndWholeNephews: 'optionNo'
                }
            };

            AnySurvivingWholeNiecesAndWholeNephews.action(ctx, formdata);
            assert.isUndefined(ctx.allWholeNiecesAndWholeNephewsOver18);
        });
    });
});
