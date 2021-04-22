'use strict';

const journey = require('app/journeys/intestacy');
const initSteps = require('../../../app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const coreContextMockData = require('../../data/core-context-mock-data.json');
const DiedAfterOctober2014 = steps.DiedAfterOctober2014;

describe('DiedAfterOctober2014', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = DiedAfterOctober2014.constructor.getUrl();
            expect(url).to.equal('/died-after-october-2014');
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
                    diedAfter: 'optionYes'
                }
            };
            const res = {};

            const ctx = DiedAfterOctober2014.getContextData(req, res);
            expect(ctx).to.deep.equal({
                ...coreContextMockData,
                sessionID: 'dummy_sessionId',
                diedAfter: 'optionYes'
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
                            left: 'optionNo'
                        }
                    }
                }
            };
            const ctx = {
                diedAfter: 'optionYes'
            };
            const nextStepUrl = DiedAfterOctober2014.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/related-to-deceased');
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
                            left: 'optionNo'
                        }
                    }
                }
            };
            const ctx = {
                diedAfter: 'optionNo'
            };
            const nextStepUrl = DiedAfterOctober2014.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/notDiedAfterOctober2014');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = DiedAfterOctober2014.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'diedAfter',
                    value: 'optionYes',
                    choice: 'diedAfter'
                }]
            });
            done();
        });
    });
});
