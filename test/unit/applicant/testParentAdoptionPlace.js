'use strict';

const journey = require('app/journeys/intestacy');
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ParentAdoptionPlace = steps.ParentAdoptionPlace;

describe('ApplicantParentAdoptionPlace', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ParentAdoptionPlace.constructor.getUrl();
            expect(url).to.equal('/parent-adoption-place');
            done();
        });
    });
    describe('nextStepUrl()', () => {
        it('should return the correct url when the grandchild parent adoption took place inside England and Wales', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                deceasedMaritalStatus: 'optionMarried',
                relationshipToDeceased: 'optionChild',
                parentAdoptedIn: 'optionYes',
                parentAdoptionPlace: 'optionYes'
            };
            const nextStepUrl = ParentAdoptionPlace.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/adopted-in');
            done();
        });

        it('should return the correct url when the adoption took place outside England and Wales', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                deceasedMaritalStatus: 'optionMarried',
                relationshipToDeceased: 'optionChild',
                parentAdoptedIn: 'optionYes',
                parentAdoptionPlace: 'optionNo'
            };
            const nextStepUrl = ParentAdoptionPlace.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/adoptionNotEnglandOrWales');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = ParentAdoptionPlace.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'parentAdoptionPlace', value: 'optionYes', choice: 'parentAdoptedInEnglandOrWales'}
                ]
            });
            done();
        });
    });
});
