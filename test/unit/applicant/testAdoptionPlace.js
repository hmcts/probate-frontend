'use strict';

const journey = require('app/journeys/intestacy');
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const AdoptionPlace = steps.AdoptionPlace;

describe('PrimaryApplicantAdoptionPlace', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AdoptionPlace.constructor.getUrl();
            expect(url).to.equal('/adopted-in-england-or-wales');
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
                adoptedIn: 'optionYes',
                adoptionPlace: 'optionYes'
            };
            const nextStepUrl = AdoptionPlace.nextStepUrl(req, ctx);
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
                adoptedIn: 'optionYes',
                adoptionPlace: 'optionNo'
            };
            const nextStepUrl = AdoptionPlace.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/adoptionNotEnglandOrWales');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
            const nextStepOptions = AdoptionPlace.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {key: 'childOrGrandChildAdoptedInEnglandOrWales', value: true, choice: 'childOrGrandChildAdoptedInEnglandOrWales'},
                    {key: 'siblingAdoptedInEnglandOrWales', value: true, choice: 'siblingAdoptedInEnglandOrWales'}
                ]
            });
            done();
        });
    });
});
