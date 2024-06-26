'use strict';

const initSteps = require('app/core/initSteps');
const journeyProbate = require('app/journeys/probate');
const {expect} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const DeceasedAliasNameOnWill = steps.DeceasedAliasNameOnWill;
const PreviousStep = steps.DeceasedNameAsOnWill;

describe('DeceasedAliasNameOnWill', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedAliasNameOnWill.constructor.getUrl();
            expect(url).to.equal('/deceased-alias-name-on-will');
            done();
        });
    });

    describe('previousStepUrl()', () => {
        let ctx;
        it('should return the previous step url', (done) => {
            const res = {
                redirect: (url) => url
            };
            const req = {
                session: {
                    language: 'en',
                    form: {
                        language: {
                            bilingual: 'optionYes'
                        },
                        deceased: {
                            firstName: 'John',
                            lastName: 'Doe'
                        },
                        declaration: {
                            declarationCheckbox: 'true'
                        }
                    },
                    back: ['hello']
                }
            };
            req.session.journey = journeyProbate;
            ctx = {};
            DeceasedAliasNameOnWill.previousStepUrl(req, res, ctx);
            expect(ctx.previousUrl).to.equal(PreviousStep.constructor.getUrl());
            done();
        });
    });

});
