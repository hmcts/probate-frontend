'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const startEligibility = steps.StartEligibility;
describe('StartEligibility', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = startEligibility.constructor.getUrl();
            expect(url).to.equal('/start-eligibility');
            done();
        });
    });

    describe('shouldHaveBackLink()', () => {
        it('should not have a back link', (done) => {
            const actual = startEligibility.shouldHaveBackLink();
            expect(actual).to.equal(false);
            done();
        });
    });
});
