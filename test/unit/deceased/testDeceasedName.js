'use strict';

const initSteps = require('app/core/initSteps');
const journeyProbate = require('app/journeys/probate');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const DeceasedName = steps.DeceasedName;
const PreviousStep = steps.BilingualGOP;
describe('DeceasedName', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedName.constructor.getUrl();
            expect(url).to.equal('/deceased-name');
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                index: 3683
            };
            DeceasedName.action(ctx);
            assert.isUndefined(ctx.index);
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
            DeceasedName.previousStepUrl(req, res, ctx);
            expect(ctx.previousUrl).to.equal(PreviousStep.constructor.getUrl());
            done();
        });
    });

});
