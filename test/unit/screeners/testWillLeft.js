'use strict';

const journey = require('app/journeys/probate');
const initSteps = require('../../../app/core/initSteps');
const {expect, assert} = require('chai');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const WillLeft = steps.WillLeft;
const content = require('app/resources/en/translation/screeners/willleft');

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
                    form: {},
                    journeyType: 'Probate'
                },
                body: {
                    left: content.optionYes
                }
            };
            const res = {};

            const ctx = WillLeft.getContextData(req, res);
            expect(ctx).to.deep.equal({
                sessionID: 'dummy_sessionId',
                left: content.optionYes,
                journeyType: 'Probate'
            });
            done();
        });
    });

    describe('handlePost()', () => {
        it('should remove session.form and set session.willLeft', (done) => {
            const ctxToTest = {
                left: content.optionYes
            };
            const errorsToTest = {};
            const formdata = {};
            const session = {
                form: {}
            };
            const [ctx, errors] = WillLeft.handlePost(ctxToTest, errorsToTest, formdata, session);
            expect(session).to.deep.equal({
                willLeft: content.optionYes
            });
            expect(ctx).to.deep.equal({
                left: content.optionYes
            });
            expect(errors).to.deep.equal({});
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
                left: content.optionYes
            };
            const nextStepUrl = WillLeft.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/will-original');
            done();
        });

        it('should return the correct url when No is given', (done) => {
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
        it('should return the correct options when the FT is off', (done) => {
            const ctx = {
                isIntestacyQuestionsToggleEnabled: false
            };
            const nextStepOptions = WillLeft.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'left',
                    value: content.optionYes,
                    choice: 'withWill'
                }]
            });
            done();
        });

        it('should return the correct options when the FT is on', (done) => {
            const ctx = {
                isIntestacyQuestionsToggleEnabled: true
            };
            const nextStepOptions = WillLeft.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [
                    {
                        key: 'left',
                        value: content.optionYes,
                        choice: 'withWill'
                    },
                    {
                        key: 'left',
                        value: content.optionNo,
                        choice: 'withoutWillToggleOn'
                    }
                ]
            });
            done();
        });
    });

    describe('action', () => {
        it('test isIntestacyQuestionsToggleEnabled is removed from the context', () => {
            const ctx = {
                isIntestacyQuestionsToggleEnabled: false
            };
            WillLeft.action(ctx);
            assert.isUndefined(ctx.isIntestacyQuestionsToggleEnabled);
        });
    });
});
