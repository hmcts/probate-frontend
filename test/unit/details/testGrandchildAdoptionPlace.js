'use strict';

const journey = require('app/journeys/intestacy');
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const GrandchildAdoptionPlace = steps.GrandchildAdoptionPlace;

describe('GrandchildAdoptionPlace', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = GrandchildAdoptionPlace.constructor.getUrl();
            expect(url).to.equal('/grandchild-adoption-place');
            done();
        });
    });
    describe('nextStepUrl()', () => {
        it('should return the correct url when the grandchild adoption took place outside England and Wales', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                deceasedMaritalStatus: 'optionMarried',
                relationshipToDeceased: 'optionChild',
                grandchildAdoptedIn: 'optionYes',
                grandchildAdoptionPlace: 'optionYes'
            };
            const nextStepUrl = GrandchildAdoptionPlace.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/any-other-children');
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
                grandchildAdoptedIn: 'optionYes',
                grandchildAdoptionPlace: 'optionNo'
            };
            const nextStepUrl = GrandchildAdoptionPlace.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/adoptionNotEnglandOrWales');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = GrandchildAdoptionPlace.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'grandchildAdoptionPlace', value: 'optionYes', choice: 'grandchildAdoptedInEnglandOrWales'}
                ]
            });
            done();
        });
    });
});
