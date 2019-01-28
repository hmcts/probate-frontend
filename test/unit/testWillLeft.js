'use strict';

const journey = require('app/journeys/probate');
const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const content = require('app/resources/en/translation/will/left');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const WillLeft = steps.WillLeft;
const pageUrl = '/will-left';
const fieldKey = 'left';

describe('WillLeft', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = WillLeft.constructor.getUrl();
            expect(url).to.equal('/will-left');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the correct context on GET', (done) => {
            const req = {
                method: 'GET',
                sessionID: 'dummy_sessionId',
                session: {
                    form: {}
                },
                body: {
                    left: content.optionYes
                }
            };
            const res = {};

            const ctx = WillLeft.getContextData(req, res, pageUrl, fieldKey);
            expect(ctx).to.deep.equal({
                sessionID: 'dummy_sessionId',
                left: content.optionYes
            });
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return url for the next step', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                left: content.optionYes
            };
            const nextStepUrl = WillLeft.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/will-original');
            done();
        });

        it('should return the url for the stop page', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                left: content.optionNo
            };
            const nextStepUrl = WillLeft.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/noWill');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = WillLeft.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'left',
                    value: content.optionYes,
                    choice: 'withWill'
                }]
            });
            done();
        });
    });
});
