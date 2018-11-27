'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const journey = require('app/journeys/probate');
const content = require('app/resources/en/translation/will/neworiginal');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const NewWillOriginal = steps.NewWillOriginal;

describe('NewWillOriginal', () => {
    describe('nextStepUrl()', () => {
        it('should return url for the next step', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                original: 'Yes'
            };
            const NewWillOriginal = steps.NewWillOriginal;
            const nextStepUrl = NewWillOriginal.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/new-applicant-executor');
            done();
        });

        it('should return the url for the stop page', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                original: 'No'
            };
            const NewWillOriginal = steps.NewWillOriginal;
            const nextStepUrl = NewWillOriginal.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/notOriginal');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = NewWillOriginal.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'original',
                    value: content.optionYes,
                    choice: 'isOriginal'
                }]
            });
            done();
        });
    });
});
