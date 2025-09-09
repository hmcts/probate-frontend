'use strict';

const journey = require('app/journeys/intestacy');
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const SeparationPlace = steps.SeparationPlace;

describe('SeparationPlace', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = SeparationPlace.constructor.getUrl();
            expect(url).to.equal('/deceased-separation-place');
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when Yes is given', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                separationPlace: 'optionYes'
            };
            const nextStepUrl = SeparationPlace.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/deceased-separation-date');
            done();
        });

        it('should return the correct url when No is given and legal act is Divorce', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                separationPlace: 'optionNo'
            };
            const nextStepUrl = SeparationPlace.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/separationPlace');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = SeparationPlace.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'separationPlace',
                    value: 'optionYes',
                    choice: 'inEnglandOrWales'
                }]
            });
            done();
        });
    });
});
