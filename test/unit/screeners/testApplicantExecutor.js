'use strict';

const journey = require('app/journeys/probate');
const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ApplicantExecutor = steps.ApplicantExecutor;
const content = require('app/resources/en/translation/screeners/applicantexecutor');

describe('ApplicantExecutor', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ApplicantExecutor.constructor.getUrl();
            expect(url).to.equal('/applicant-executor');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the correct context on GET', (done) => {
            const req = {
                method: 'GET',
                sessionID: 'dummy_sessionId',
                session: {
                    form: {},
                    journeyType: 'Probate'
                },
                body: {
                    executor: content.optionYes
                }
            };
            const res = {};

            const ctx = ApplicantExecutor.getContextData(req, res);
            expect(ctx).to.deep.equal({
                sessionID: 'dummy_sessionId',
                executor: content.optionYes,
                journeyType: 'Probate'
            });
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return the correct url when Yes is given', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                executor: content.optionYes
            };
            const nextStepUrl = ApplicantExecutor.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/mental-capacity');
            done();
        });

        it('should return the correct url when No is given', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                executor: content.optionNo
            };
            const nextStepUrl = ApplicantExecutor.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/notExecutor');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = ApplicantExecutor.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'executor',
                    value: content.optionYes,
                    choice: 'isExecutor'
                }]
            });
            done();
        });
    });
});
