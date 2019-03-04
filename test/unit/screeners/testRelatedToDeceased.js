'use strict';

const journey = require('app/journeys/intestacy');
const initSteps = require('../../../app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const RelatedToDeceased = steps.RelatedToDeceased;
const content = require('app/resources/en/translation/screeners/relatedtodeceased');

describe('RelatedToDeceased', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = RelatedToDeceased.constructor.getUrl();
            expect(url).to.equal('/related-to-deceased');
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
                    related: content.optionYes
                }
            };
            const res = {};

            const ctx = RelatedToDeceased.getContextData(req, res);
            expect(ctx).to.deep.equal({
                sessionID: 'dummy_sessionId',
                related: content.optionYes,
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
                related: content.optionYes
            };
            const nextStepUrl = RelatedToDeceased.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/other-applicants');
            done();
        });

        it('should return the correct url when No is given', (done) => {
            const req = {
                session: {
                    journey: journey
                }
            };
            const ctx = {
                related: content.optionNo
            };
            const nextStepUrl = RelatedToDeceased.nextStepUrl(req, ctx);
            expect(nextStepUrl).to.equal('/stop-page/notRelated');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = RelatedToDeceased.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{
                    key: 'related',
                    value: content.optionYes,
                    choice: 'related'
                }]
            });
            done();
        });
    });
});
