'use strict';

const journey = require('app/journeys/intestacy');
const initSteps = require('../../../app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const coreContextMockData = require('../../data/core-context-mock-data.json');
const OtherApplicants = steps.OtherApplicants;

describe('OtherApplicants', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = OtherApplicants.constructor.getUrl();
            expect(url).to.equal('/other-applicants');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the correct context on GET', (done) => {
            const req = {
                method: 'GET',
                sessionID: 'dummy_sessionId',
                session: {
                    language: 'en',
                    form: {
                        ccdCase: {
                            id: 1234567890123456,
                            state: 'Pending'
                        }
                    },
                    caseType: 'gop'
                },
                body: {
                    otherApplicants: 'optionYes'
                }
            };
            const res = {};

            const ctx = OtherApplicants.getContextData(req, res);
            expect(ctx).to.deep.equal({
                ...coreContextMockData,
                sessionID: 'dummy_sessionId',
                otherApplicants: 'optionYes'
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
                            deathCertificate: 'optionYes',
                            domicile: 'optionYes',
                            completed: 'optionYes',
                            left: 'optionNo',
                            diedAfter: 'optionYes',
                            related: 'optionYes'
                        }
                    }
                }
            };
            const ctx = {
                otherApplicants: 'optionYes'
            };
            const nextStepUrl = OtherApplicants.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/otherApplicants');
            done();
        });

        it('should return the correct url when No is given', (done) => {
            const req = {
                session: {
                    journey: journey,
                    form: {
                        screeners: {
                            deathCertificate: 'optionYes',
                            domicile: 'optionYes',
                            completed: 'optionYes',
                            left: 'optionNo',
                            diedAfter: 'optionYes',
                            related: 'optionYes'
                        }
                    }
                }
            };
            const ctx = {
                otherApplicants: 'optionNo'
            };
            const nextStepUrl = OtherApplicants.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/start-apply');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = OtherApplicants.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'otherApplicants',
                    value: 'optionNo',
                    choice: 'noOthers'
                }]
            });
            done();
        });
    });
});
