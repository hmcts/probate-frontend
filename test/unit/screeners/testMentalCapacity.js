'use strict';

const journey = require('app/journeys/probate');
const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const MentalCapacity = steps.MentalCapacity;
const content = require('app/resources/en/translation/screeners/mentalcapacity');

describe('MentalCapacity', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = MentalCapacity.constructor.getUrl();
            expect(url).to.equal('/mental-capacity');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the correct context on GET', (done) => {
            const req = {
                method: 'GET',
                sessionID: 'dummy_sessionId',
                session: {
                    form: {
                        ccdCase: {
                            id: 1234567890123456,
                            state: 'Pending'
                        }
                    },
                    caseType: 'gop'
                },
                body: {
                    mentalCapacity: content.optionYes
                }
            };
            const res = {};

            const ctx = MentalCapacity.getContextData(req, res);
            expect(ctx).to.deep.equal({
                sessionID: 'dummy_sessionId',
                mentalCapacity: content.optionYes,
                caseType: 'gop',
                featureToggles: {
                    webforms: 'false'
                },
                userLoggedIn: false,
                ccdCase: {
                    id: 1234567890123456,
                    state: 'Pending'
                }
            });
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when Yes is given', (done) => {
            const req = {
                session: {
                    journey: journey,
                    form: {
                        screeners: {
                            deathCertificate: 'Yes',
                            domicile: 'Yes',
                            completed: 'Yes',
                            left: 'Yes',
                            original: 'Yes',
                            executor: 'Yes'
                        }
                    }
                }
            };
            const ctx = {
                mentalCapacity: content.optionYes
            };
            const nextStepUrl = MentalCapacity.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/start-apply');
            done();
        });

        it('should return the correct url when No is given', (done) => {
            const req = {
                session: {
                    journey: journey,
                    form: {
                        screeners: {
                            deathCertificate: 'Yes',
                            domicile: 'Yes',
                            completed: 'Yes',
                            left: 'Yes',
                            original: 'Yes',
                            executor: 'Yes'
                        }
                    }
                }
            };
            const ctx = {
                mentalCapacity: content.optionNo
            };
            const nextStepUrl = MentalCapacity.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/mentalCapacity');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = MentalCapacity.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'mentalCapacity',
                    value: content.optionYes,
                    choice: 'isCapable'
                }]
            });
            done();
        });
    });
});
