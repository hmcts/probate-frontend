'use strict';

const journey = require('app/journeys/intestacy');
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const AdoptionPlace = steps.PlaceOfAdoption;

describe('AdoptionPlace', () => {
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
                    {key: 'adoptionPlace', value: 'optionYes', choice: 'adoptedInEnglandOrWales'}
                ]
            });
            done();
        });
    });
    describe('handlePost()', () => {
        let ctx;
        let errors;
        let formdata;
        const session = {};

        it('should set childAdoptionPlace if relationship is child', (done) => {
            ctx = {
                relationshipToDeceased: 'optionChild',
                adoptedIn: 'optionYes',
                adoptionPlace: 'optionYes',
                isSaveAndClose: 'false'
            };
            errors = [];
            [ctx, errors] = AdoptionPlace.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                relationshipToDeceased: 'optionChild',
                adoptedIn: 'optionYes',
                adoptionPlace: 'optionYes',
                isSaveAndClose: 'false',
                childAdoptionPlace: 'optionYes'
            });
            done();
        });
        it('should set grandchildParentAdoptionPlace if relationship is grandchild', (done) => {
            ctx = {
                relationshipToDeceased: 'optionGrandchild',
                adoptedIn: 'optionYes',
                adoptionPlace: 'optionYes',
                isSaveAndClose: 'false'
            };
            errors = [];
            [ctx, errors] = AdoptionPlace.handlePost(ctx, errors, formdata, session);
            expect(ctx).to.deep.equal({
                relationshipToDeceased: 'optionGrandchild',
                adoptedIn: 'optionYes',
                adoptionPlace: 'optionYes',
                isSaveAndClose: 'false',
                grandchildParentAdoptionPlace: 'optionYes'
            });
            done();
        });
    });
});
