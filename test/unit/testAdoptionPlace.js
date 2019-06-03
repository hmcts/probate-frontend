'use strict';

const journey = require('app/journeys/intestacy');
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const AdoptionPlace = steps.AdoptionPlace;
const content = require('app/resources/en/translation/applicant/adoptionplace');
const contentMaritalStatus = require('app/resources/en/translation/deceased/maritalstatus');

describe('AdoptionPlace', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = AdoptionPlace.constructor.getUrl();
            expect(url).to.equal('/adoption-place');
            done();
        });
    });

    describe('getContextData()', () => {
        let ctx;
        let req;

        it('should return the context with the deceased name', (done) => {
            req = {
                session: {
                    form: {
                        deceased: {
                            maritalStatus: contentMaritalStatus.optionMarried
                        }
                    }
                }
            };

            ctx = AdoptionPlace.getContextData(req);
            expect(ctx.deceasedMaritalStatus).to.equal(contentMaritalStatus.optionMarried);
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when the adoption took place outside England and Wales and the deceased was married', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                adoptionPlace: content.optionYes,
                deceasedMaritalStatus: contentMaritalStatus.optionMarried
            };
            const nextStepUrl = AdoptionPlace.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/spouse-not-applying-reason');
            done();
        });

        it('should return the correct url when the adoption took place outside England and Wales and the deceased was not married', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                adoptionPlace: content.optionYes,
                deceasedMaritalStatus: contentMaritalStatus.optionDivorced
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
                adoptionPlace: content.optionNo
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
                    {key: 'inEnglandOrWalesDeceasedMarried', value: true, choice: 'inEnglandOrWalesDeceasedMarried'},
                    {key: 'inEnglandOrWalesDeceasedNotMarried', value: true, choice: 'inEnglandOrWalesDeceasedNotMarried'}
                ]
            });
            done();
        });
    });
});
