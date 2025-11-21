'use strict';

const journey = require('app/journeys/intestacy');
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const AdoptedIn = steps.AdoptedIn;
const content = require('app/resources/en/translation/details/adoptedin');

describe('AdoptedIn', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AdoptedIn.constructor.getUrl();
            expect(url).to.equal('/adopted-in');
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

            ctx = AdoptedIn.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            expect(ctx.relationshipToDeceased).to.equal('optionChild');
            done();
        });
    });

    describe('nextStepUrl()', () => {

        it('should return the correct url when the child is adopted in and the deceased was married', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                deceasedMaritalStatus: 'optionMarried',
                relationshipToDeceased: 'optionChild',
                adoptedIn: 'optionYes',
            };
            const nextStepUrl = AdoptedIn.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/adopted-in-england-or-wales');
            done();
        });

        it('should return the correct url when the child is not adopted In', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                deceasedMaritalStatus: 'optionMarried',
                relationshipToDeceased: 'optionChild',
                adoptedIn: 'optionNo',
            };
            const nextStepUrl = AdoptedIn.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/adopted-out');
            done();
        });
    });

    describe('generateFields()', () => {
        it('should return the correct content fields', (done) => {
            const ctx = {
                language: 'en',
                deceasedName: 'John Doe',
                relationshipToDeceased: 'optionChild'
            };
            const errors = [
                {
                    field: 'adoptedIn',
                    href: '#adoptedIn',
                    msg: content.errors.adoptedIn.requiredChild
                }
            ];

            const fields = AdoptedIn.generateFields('en', ctx, errors);
            expect(fields).to.deep.equal({
                language: {
                    error: false,
                    value: 'en'
                },
                adoptedIn: {
                    error: true,
                    href: '#adoptedIn',
                    errorMessage: content.errors.adoptedIn.requiredChild
                },
                deceasedName: {
                    error: false,
                    value: 'John Doe'
                },
                relationshipToDeceased: {
                    error: false,
                    value: 'optionChild'
                }
            });
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = AdoptedIn.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'adoptedIn', value: 'optionYes', choice: 'adoptedIn'},
                    {key: 'adoptedIn', value: 'optionNo', choice: 'notAdoptedIn'}
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

        it('should set childAdoptedIn if relationship is child', (done) => {
            ctx = {
                relationshipToDeceased: 'optionChild',
                adoptedIn: 'optionYes',
                isSaveAndClose: 'false'
            };
            formdata = {
                applicant: {
                    relationshipToDeceased: 'optionChild'
                }
            };
            errors = [];
            [ctx, errors] = AdoptedIn.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                relationshipToDeceased: 'optionChild',
                adoptedIn: 'optionYes',
                isSaveAndClose: 'false',
                childAdoptedIn: 'optionYes'
            });
            done();
        });
        it('should set grandchildParentAdoptedIn if relationship is grandchild', (done) => {
            ctx = {
                relationshipToDeceased: 'optionGrandchild',
                adoptedIn: 'optionYes',
                isSaveAndClose: 'false'
            };
            formdata = {
                applicant: {
                    relationshipToDeceased: 'optionGrandchild'
                }
            };
            errors = [];
            [ctx, errors] = AdoptedIn.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                relationshipToDeceased: 'optionGrandchild',
                adoptedIn: 'optionYes',
                isSaveAndClose: 'false',
                grandchildParentAdoptedIn: 'optionYes'
            });
            done();
        });
        it('should return the error when adoptedIn is missing and relationship is child', (done) => {
            ctx = {
                relationshipToDeceased: 'optionChild',
                isSaveAndClose: 'false',
                deceasedName: 'John Doe'
            };
            errors = [];
            [ctx, errors] = AdoptedIn.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'adoptedIn',
                    href: '#adoptedIn',
                    msg: content.errors.adoptedIn.requiredChild.replace('{deceasedName}', 'John Doe')
                }
            ]);
            done();
        });
        it('should return the error when adoptedIn is missing and relationship is grandchild', (done) => {
            ctx = {
                relationshipToDeceased: 'optionGrandchild',
                isSaveAndClose: 'false',
                deceasedName: 'John Doe'
            };
            errors = [];
            [ctx, errors] = AdoptedIn.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'adoptedIn',
                    href: '#adoptedIn',
                    msg: content.errors.adoptedIn.requiredGrandchild.replace('{deceasedName}', 'John Doe')
                }
            ]);
            done();
        });
    });
});
