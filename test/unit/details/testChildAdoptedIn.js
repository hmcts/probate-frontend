'use strict';

const journey = require('app/journeys/intestacy');
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ChildAdoptedIn = steps.ChildAdoptedIn;
const content = require('app/resources/en/translation/details/childadoptedin');

describe('ChildAdoptedIn', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ChildAdoptedIn.constructor.getUrl();
            expect(url).to.equal('/child-adopted-in');
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

            ctx = ChildAdoptedIn.getContextData(req);
            expect(ctx.deceasedName).to.equal('John Doe');
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
                childAdoptedIn: 'optionYes',
            };
            const nextStepUrl = ChildAdoptedIn.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/child-adoption-place');
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
                childAdoptedIn: 'optionNo',
            };
            const nextStepUrl = ChildAdoptedIn.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/child-adopted-out');
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
                    field: 'childAdoptedIn',
                    href: '#childAdoptedIn',
                    msg: content.errors.childAdoptedIn.required
                }
            ];

            const fields = ChildAdoptedIn.generateFields('en', ctx, errors);
            expect(fields).to.deep.equal({
                language: {
                    error: false,
                    value: 'en'
                },
                childAdoptedIn: {
                    error: true,
                    href: '#childAdoptedIn',
                    errorMessage: content.errors.childAdoptedIn.required
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
            const nextStepOptions = ChildAdoptedIn.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'childAdoptedIn', value: 'optionYes', choice: 'childAdoptedIn'},
                    {key: 'childAdoptedIn', value: 'optionNo', choice: 'childNotAdoptedIn'}
                ]
            });
            done();
        });
    });
});
