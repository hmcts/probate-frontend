'use strict';

const journey = require('app/journeys/intestacy');
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const GrandchildAdoptedIn = steps.GrandchildAdoptedIn;
const content = require('app/resources/en/translation/details/grandchildadoptedin');

describe('GrandchildAdoptedIn', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = GrandchildAdoptedIn.constructor.getUrl();
            expect(url).to.equal('/mainapplicantsparent-adopted-you-in');
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

            ctx = GrandchildAdoptedIn.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
            done();
        });
    });

    describe('nextStepUrl()', () => {

        it('should return the correct url when the grandchild is adopted in and the deceased was married', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                deceasedMaritalStatus: 'optionMarried',
                relationshipToDeceased: 'optionGrandchild',
                grandchildAdoptedIn: 'optionYes',
            };
            const nextStepUrl = GrandchildAdoptedIn.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/grandchild-adoption-place');
            done();
        });

        it('should return the correct url when the grandchild is not adopted In', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                deceasedMaritalStatus: 'optionMarried',
                relationshipToDeceased: 'optionChild',
                grandchildAdoptedIn: 'optionNo',
            };
            const nextStepUrl = GrandchildAdoptedIn.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/mainapplicantsparent-adopted-you-out');
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
                    field: 'grandchildAdoptedIn',
                    href: '#grandchildAdoptedIn',
                    msg: content.errors.grandchildAdoptedIn.required
                }
            ];

            const fields = GrandchildAdoptedIn.generateFields('en', ctx, errors);
            expect(fields).to.deep.equal({
                language: {
                    error: false,
                    value: 'en'
                },
                grandchildAdoptedIn: {
                    error: true,
                    href: '#grandchildAdoptedIn',
                    errorMessage: content.errors.grandchildAdoptedIn.required
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
            const nextStepOptions = GrandchildAdoptedIn.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'grandchildAdoptedIn', value: 'optionYes', choice: 'grandchildAdoptedIn'},
                    {key: 'grandchildAdoptedIn', value: 'optionNo', choice: 'grandchildNotAdoptedIn'}
                ]
            });
            done();
        });
    });
});
