'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const journey = require('app/journeys/probate');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

describe('WillOriginal', () => {
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
            const WillOriginal = steps.WillOriginal;
            const nextStepUrl = WillOriginal.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/will-codicils');
            done();
        });

        it('should return the url for the stop page', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {};
            const WillOriginal = steps.WillOriginal;
            const nextStepUrl = WillOriginal.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/notOriginal');
            done();
        });
    });
});
