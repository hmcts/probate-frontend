'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const IhtEstateForm = steps.IhtEstateForm;

describe('EstateForm', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = IhtEstateForm.constructor.getUrl();
            expect(url).to.equal('/estate-form');
            done();
        });
    });

    describe('nextStepOptions()', () => {
        it('should return the correct options', (done) => {
            const nextStepOptions = IhtEstateForm.nextStepOptions();
            expect(nextStepOptions).to.deep.equal({
                options: [{key: 'ihtFormEstateId', value: 'optionIHT207', choice: '207'}]
            });
            done();
        });
    });
});
