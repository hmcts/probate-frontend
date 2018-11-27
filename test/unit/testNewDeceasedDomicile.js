'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const journey = require('app/journeys/probate');
const content = require('app/resources/en/translation/deceased/newdomicile');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const NewDeceasedDomicile = steps.NewDeceasedDomicile;

describe('NewDeceasedDomicile', () => {
    describe('nextStepUrl()', () => {
        it('should return url for the next step', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                domicile: 'Yes'
            };
            const NewDeceasedDomicile = steps.NewDeceasedDomicile;
            const nextStepUrl = NewDeceasedDomicile.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/new-iht-completed');
            done();
        });

        it('should return the url for the stop page', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                domicile: 'No'
            };
            const NewDeceasedDomicile = steps.NewDeceasedDomicile;
            const nextStepUrl = NewDeceasedDomicile.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/notInEnglandOrWales');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = NewDeceasedDomicile.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'domicile',
                    value: content.optionYes,
                    choice: 'inEnglandOrWales'
                }]
            });
            done();
        });
    });
});
