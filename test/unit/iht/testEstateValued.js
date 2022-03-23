'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const IhtEstateValued = steps.IhtEstateValued;

describe('EstateValued', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = IhtEstateValued.constructor.getUrl();
            expect(url).to.equal('/estate-valued');
            done();
        });
    });

});
