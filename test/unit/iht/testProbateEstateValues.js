'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ProbateEstateValues = steps.ProbateEstateValues;

describe('ProbateEstateValues', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ProbateEstateValues.constructor.getUrl();
            expect(url).to.equal('/probate-estate-values');
            done();
        });
    });
});
