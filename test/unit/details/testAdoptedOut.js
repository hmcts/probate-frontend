'use strict';

const journey = require('app/journeys/intestacy');
const initSteps = require('app/core/initSteps');
const content = require('../../../app/resources/en/translation/details/adoptedout.json');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const AdoptedOut = steps.AdoptedOut;

describe('AdoptedOut', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AdoptedOut.constructor.getUrl();
            expect(url).to.equal('/adopted-out');
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
                        },
                        applicant: {
                            relationshipToDeceased: 'optionChild'
                        }
                    }
                }
            };

            ctx = AdoptedOut.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            expect(ctx.relationshipToDeceased).to.equal('optionChild');
            done();
        });
    });

    describe('nextStepUrl()', () => {

        it('should return the correct url when the child is not adopted out', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                deceasedMaritalStatus: 'optionMarried',
                relationshipToDeceased: 'optionChild',
                adoptedOut: 'optionNo',
            };
            const nextStepUrl = AdoptedOut.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/any-other-children');
            done();
        });

        it('should return the correct url when the child is adopted out', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                deceasedMaritalStatus: 'optionMarried',
                relationshipToDeceased: 'optionChild',
                adoptedOut: 'optionYes',
            };
            const nextStepUrl = AdoptedOut.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/adoptedOut');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = AdoptedOut.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'childNotAdoptedOut', value: true, choice: 'childNotAdoptedOut'},
                    {key: 'grandchildNotAdoptedOut', value: true, choice: 'grandchildNotAdoptedOut'}
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

        it('should set childAdoptedOut if relationship is child', (done) => {
            ctx = {
                relationshipToDeceased: 'optionChild',
                adoptedOut: 'optionYes',
                isSaveAndClose: 'false'
            };
            errors = [];
            [ctx, errors] = AdoptedOut.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                relationshipToDeceased: 'optionChild',
                adoptedOut: 'optionYes',
                isSaveAndClose: 'false',
                childAdoptedOut: 'optionYes'
            });
            done();
        });
        it('should set grandchildParentAdoptedOut if relationship is grandchild', (done) => {
            ctx = {
                relationshipToDeceased: 'optionGrandchild',
                adoptedOut: 'optionYes',
                isSaveAndClose: 'false'
            };
            errors = [];
            [ctx, errors] = AdoptedOut.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                relationshipToDeceased: 'optionGrandchild',
                adoptedOut: 'optionYes',
                isSaveAndClose: 'false',
                grandchildParentAdoptedOut: 'optionYes'
            });
            done();
        });
        it('should return the error when adoptedOut is missing and relationship is child', (done) => {
            ctx = {
                relationshipToDeceased: 'optionChild',
                isSaveAndClose: 'false',
                deceasedName: 'John Doe'
            };
            errors = [];
            [ctx, errors] = AdoptedOut.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'adoptedOut',
                    href: '#adoptedOut',
                    msg: content.errors.adoptedOut.requiredChild.replace('{deceasedName}', 'John Doe')
                }
            ]);
            done();
        });
        it('should return the error when adoptedOut is missing and relationship is grandchild', (done) => {
            ctx = {
                relationshipToDeceased: 'optionGrandchild',
                isSaveAndClose: 'false',
                deceasedName: 'John Doe'
            };
            errors = [];
            [ctx, errors] = AdoptedOut.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'adoptedOut',
                    href: '#adoptedOut',
                    msg: content.errors.adoptedOut.requiredGrandchild.replace('{deceasedName}', 'John Doe')
                }
            ]);
            done();
        });
    });
});
