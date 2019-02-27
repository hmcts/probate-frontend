'use strict';

const journey = require('app/journeys/intestacy');
const initSteps = require('../../../app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const OtherApplicants = steps.OtherApplicants;
const content = require('app/resources/en/translation/screeners/otherapplicants');

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
                    form: {},
                    journeyType: 'Probate'
                },
                body: {
                    otherApplicants: content.optionYes
                }
            };
            const res = {};

            const ctx = OtherApplicants.getContextData(req, res);
            expect(ctx).to.deep.equal({
                sessionID: 'dummy_sessionId',
                otherApplicants: content.optionYes,
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
                otherApplicants: content.optionYes
            };
            const nextStepUrl = OtherApplicants.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/otherApplicants');
            done();
        });

        it('should return the correct url when No is given', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                otherApplicants: content.optionNo
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
                    value: content.optionNo,
                    choice: 'noOthers'
                }]
            });
            done();
        });
    });
});
