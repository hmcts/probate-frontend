'use strict';

const journey = require('app/journeys/intestacy');
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ParentAdoptedIn = steps.ParentAdoptedIn;
const content = require('app/resources/en/translation/applicant/parentadoptedin.json');

describe('ApplicantParentAdoptedIn', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ParentAdoptedIn.constructor.getUrl();
            expect(url).to.equal('/mainapplicantsparent-adopted-in');
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

            ctx = ParentAdoptedIn.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepUrl()', () => {

        it('should return the correct url when the grandchild parent is adopted in and the deceased was married', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                deceasedMaritalStatus: 'optionMarried',
                relationshipToDeceased: 'optionGrandchild',
                parentAdoptedIn: 'optionYes',
            };
            const nextStepUrl = ParentAdoptedIn.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/parent-adoption-place');
            done();
        });

        it('should return the correct url when the grandchild parent is not adopted In', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                deceasedMaritalStatus: 'optionMarried',
                relationshipToDeceased: 'optionChild',
                parentAdoptedIn: 'optionNo',
            };
            const nextStepUrl = ParentAdoptedIn.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/mainapplicantsparent-adopted-out');
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
                    field: 'parentAdoptedIn',
                    href: '#parentAdoptedIn',
                    msg: content.errors.parentAdoptedIn.required
                }
            ];

            const fields = ParentAdoptedIn.generateFields('en', ctx, errors);
            expect(fields).to.deep.equal({
                language: {
                    error: false,
                    value: 'en'
                },
                parentAdoptedIn: {
                    error: true,
                    href: '#parentAdoptedIn',
                    errorMessage: content.errors.parentAdoptedIn.required
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
            const nextStepOptions = ParentAdoptedIn.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'parentAdoptedIn', value: 'optionYes', choice: 'parentAdoptedIn'},
                    {key: 'parentAdoptedIn', value: 'optionNo', choice: 'parentNotAdoptedIn'}
                ]
            });
            done();
        });
    });
});
