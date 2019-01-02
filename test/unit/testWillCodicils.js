'use strict';

const journey = require('app/journeys/probate');
const initSteps = require('app/core/initSteps');
const {expect, assert} = require('chai');
const content = require('app/resources/en/translation/will/codicils');
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
        it('should return the ctx with the will codicils', (done) => {
            const req = {
                sessionID: 'dummy_sessionId',
                session: {
                    form: {
                        journeyType: 'probate'
                    }
                },
                body: {
                    codicils: content.optionYes
                }
            };
            const ctx = WillCodicils.getContextData(req);
            expect(ctx).to.deep.equal({
                codicils: 'Yes',
                sessionID: 'dummy_sessionId',
                journeyType: 'probate'
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
                codicils: content.optionYes
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
                codicils: content.optionNo
            };
            const WillCodicils = steps.WillCodicils;
            const nextStepUrl = WillCodicils.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/tasklist');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const ctx = {};
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
    });

    describe('action', () => {
        it('cleans up context', () => {
            const ctx = {
                codicils: json.optionNo,
                codicilsNumber: 3
            };
            WillCodicils.action(ctx);
            assert.isUndefined(ctx.codicilsNumber);
        });
    });
});
