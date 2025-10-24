'use strict';

const journey = require('app/journeys/intestacy');
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ChildAdoptionPlace = steps.ChildAdoptionPlace;

describe('ChildAdoptionPlace', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ChildAdoptionPlace.constructor.getUrl();
            expect(url).to.equal('/child-adoption-place');
            done();
        });
    });
    describe('nextStepUrl()', () => {
        it('should return the correct url when the child adoption took place outside England and Wales', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                deceasedMaritalStatus: 'optionMarried',
                relationshipToDeceased: 'optionChild',
                childAdoptedIn: 'optionYes',
                childAdoptionPlace: 'optionYes'
            };
            const nextStepUrl = ChildAdoptionPlace.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/any-other-children');
            done();
        });

        it('should return the correct url when the child adoption took place outside England and Wales', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                deceasedMaritalStatus: 'optionMarried',
                relationshipToDeceased: 'optionChild',
                childAdoptedIn: 'optionYes',
                childAdoptionPlace: 'optionNo'
            };
            const nextStepUrl = ChildAdoptionPlace.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/adoptionNotEnglandOrWales');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = ChildAdoptionPlace.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'childAdoptionPlace', value: 'optionYes', choice: 'childAdoptedInEnglandOrWales'}
                ]
            });
            done();
        });
    });
});
