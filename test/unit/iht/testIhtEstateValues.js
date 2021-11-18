'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const IhtEstateValues = steps.IhtEstateValues;

describe('IhtEstateValues', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = IhtEstateValues.constructor.getUrl();
            expect(url).to.equal('/iht-estate-values');
            done();
        });
    });
});
