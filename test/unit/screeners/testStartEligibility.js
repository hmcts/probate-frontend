'use strict';

const initSteps = require('app/core/initSteps');
const journeyProbate = require('../../../app/journeys/probate');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const startEligibility = steps.StartEligibility;
const PreviousStep = steps.Dashboard;
describe('StartEligibility', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = startEligibility.constructor.getUrl();
            expect(url).to.equal('/start-eligibility');
            done();
        });
    });

    describe('handleGet()', () => {
        it('should return true when the ft_fees_api toggle is set', (done) => {
            const ctxToTest = {};
            const formdata = {};
            const featureToggles = {
                ft_fees_api: true
            };
            const [ctx] = startEligibility.handleGet(ctxToTest, formdata, featureToggles);
            expect(ctx.isFeesApiToggleEnabled).to.equal(true);
            done();
        });

        it('should return false when the ft_fees_api toggle is not set', (done) => {
            const ctxToTest = {};
            const formdata = {};
            const featureToggles = {};
            const [ctx] = startEligibility.handleGet(ctxToTest, formdata, featureToggles);
            expect(ctx.isFeesApiToggleEnabled).to.equal(false);
            done();
        });
    });

    describe('previousScrennerStepUrl()', () => {
        let ctx;
        it('should return the previous step url', (done) => {
            const res = {
                redirect: (url) => url
            };
            const req = {
                session: {
                    language: 'en'
                },
                userLoggedIn: true
            };
            req.session.journey = journeyProbate;
            ctx = {};
            startEligibility.previousScrennerStepUrl(req, res, ctx);
            expect(ctx.previousUrl).to.equal(PreviousStep.constructor.getUrl());
            done();
        });
    });
});
