'use strict';

const initSteps = require('app/core/initSteps.cjs');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const ReportEstateValues = steps.ReportEstateValues;

describe('ReportEstateValues', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = ReportEstateValues.constructor.getUrl();
            expect(url).to.equal('/report-estate-values');
            done();
        });
    });

});
