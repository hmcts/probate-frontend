'use strict';

const journey = require('app/journeys/intestacy');
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const DeceasedAdoptionPlace = steps.DeceasedAdoptionPlace;

describe('DeceasedAdoptionPlace', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DeceasedAdoptionPlace.constructor.getUrl();
            expect(url).to.equal('/deceased-adoption-place');
            done();
        });
    });
    describe('nextStepUrl()', () => {
        it('should return the correct url when the deceased adoption took place inside England and Wales', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                deceasedMaritalStatus: 'optionNotMarried',
                relationshipToDeceased: 'optionParent',
                deceasedAdoptedIn: 'optionYes',
                deceasedAdoptionPlace: 'optionYes'
            };
            const nextStepUrl = DeceasedAdoptionPlace.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/any-other-parent-alive');
            done();
        });

        it('should return the correct url when the adoption took place outside England and Wales', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                deceasedMaritalStatus: 'optionNotMarried',
                relationshipToDeceased: 'optionParent',
                deceasedAdoptedIn: 'optionYes',
                deceasedAdoptionPlace: 'optionNo'
            };
            const nextStepUrl = DeceasedAdoptionPlace.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/adoptionNotEnglandOrWales');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = DeceasedAdoptionPlace.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'deceasedAdoptionPlace', value: 'optionYes', choice: 'deceasedAdoptedInEnglandOrWales'}
                ]
            });
            done();
        });
    });
});
