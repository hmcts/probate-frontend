'use strict';

const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const journey = require('app/journeys/probate');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const WillCodicils = steps.WillCodicils;
const json = require('app/resources/en/translation/will/codicils');

describe('WillCodicils', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = WillCodicils.constructor.getUrl();
            expect(url).to.equal('/will-codicils');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the ctx with the will codicils and the screening_question feature toggle on', (done) => {
            const req = {
                sessionID: 'dummy_sessionId',
                session: {form: {}, featureToggles: {screening_questions: true}},
                body: {
                    codicils: 'Yes'
                }
            };
            const ctx = WillCodicils.getContextData(req);
            expect(ctx).to.deep.equal({
                codicils: 'Yes',
                isToggleEnabled: true,
                sessionID: 'dummy_sessionId'
            });
            done();
        });
    });

    describe('nextStepUrl()', () => {
        it('should return url for the next step if there are codicils', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                codicils: 'Yes'
            };
            const WillCodicils = steps.WillCodicils;
            const nextStepUrl = WillCodicils.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/codicils-number');
            done();
        });

        it('should return the url for the next step if there are no codicils', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                codicils: 'No'
            };
            const WillCodicils = steps.WillCodicils;
            const nextStepUrl = WillCodicils.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/death-certificate');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options when the FT is off', (done) => {
            const ctx = {
                isToggleEnabled: false
            };
            const nextStepOptions = WillCodicils.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'codicils',
                    value: json.optionNo,
                    choice: 'noCodicils'
                }]
            });
            done();
        });

        it('should return the correct options when the FT is on', (done) => {
            const ctx = {
                isToggleEnabled: true
            };
            const nextStepOptions = WillCodicils.nextStepOptions(ctx);
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'codicils',
                    value: json.optionNo,
                    choice: 'noCodicilsToggleOn'
                }]
            });
            done();
        });
    });

    describe('action', () => {
        it('test isToggleEnabled is removed from the context', () => {
            const ctx = {
                isToggleEnabled: false
            };
            WillCodicils.action(ctx);
            assert.isUndefined(ctx.isToggleEnabled);
        });
    });
});
