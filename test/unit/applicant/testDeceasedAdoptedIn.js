'use strict';

const journey = require('app/journeys/intestacy');
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const DeceasedAdoptedIn = steps.DeceasedAdoptedIn;
const content = require('app/resources/en/translation/applicant/deceasedadoptedin.json');

describe('DeceasedAdoptedIn', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedAdoptedIn.constructor.getUrl();
            expect(url).to.equal('/parent-adopted-deceased-in');
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
                        }
                    }
                }
            };

            ctx = DeceasedAdoptedIn.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepUrl()', () => {

        it('should return the correct url when the deceased is adopted in and the deceased was not married', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                deceasedMaritalStatus: 'optionNotMarried',
                relationshipToDeceased: 'optionParent',
                deceasedAdoptedIn: 'optionYes',
            };
            const nextStepUrl = DeceasedAdoptedIn.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/deceased-adoption-place');
            done();
        });

        it('should return the correct url when the deceased is not adopted In', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                deceasedMaritalStatus: 'optionNotMarried',
                relationshipToDeceased: 'optionParent',
                deceasedAdoptedIn: 'optionNo',
            };
            const nextStepUrl = DeceasedAdoptedIn.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/parent-adopted-deceased-out');
            done();
        });
    });

    describe('generateFields()', () => {
        it('should return the correct content fields', (done) => {
            const ctx = {
                language: 'en',
                deceasedName: 'John Doe',
            };
            const errors = [
                {
                    field: 'deceasedAdoptedIn',
                    href: '#deceasedAdoptedIn',
                    msg: content.errors.deceasedAdoptedIn.required
                }
            ];

            const fields = DeceasedAdoptedIn.generateFields('en', ctx, errors);
            expect(fields).to.deep.equal({
                language: {
                    error: false,
                    value: 'en'
                },
                deceasedAdoptedIn: {
                    error: true,
                    href: '#deceasedAdoptedIn',
                    errorMessage: content.errors.deceasedAdoptedIn.required
                },
                deceasedName: {
                    error: false,
                    value: 'John Doe'
                }
            });
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = DeceasedAdoptedIn.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'deceasedAdoptedIn', value: 'optionYes', choice: 'deceasedAdoptedIn'},
                    {key: 'deceasedAdoptedIn', value: 'optionNo', choice: 'deceasedNotAdoptedIn'},
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
        it('should return the error when adoptedIn is missing and relationship is parent', (done) => {
            ctx = {
                relationshipToDeceased: 'optionParent',
                isSaveAndClose: 'false',
                deceasedName: 'John Doe'
            };
            errors = [];
            [ctx, errors] = DeceasedAdoptedIn.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'deceasedAdoptedIn',
                    href: '#deceasedAdoptedIn',
                    msg: content.errors.deceasedAdoptedIn.requiredParent.replace('{deceasedName}', 'John Doe')
                }
            ]);
            done();
        });
        it('should return the error when adoptedIn is missing and relationship is Sibling', (done) => {
            ctx = {
                relationshipToDeceased: 'optionSibling',
                isSaveAndClose: 'false',
                deceasedName: 'John Doe'
            };
            errors = [];
            [ctx, errors] = DeceasedAdoptedIn.handlePost(ctx, errors, formdata, session);
            expect(errors).to.deep.equal([
                {
                    field: 'deceasedAdoptedIn',
                    href: '#deceasedAdoptedIn',
                    msg: content.errors.deceasedAdoptedIn.requiredSibling.replace('{deceasedName}', 'John Doe')
                }
            ]);
            done();
        });
    });
});
