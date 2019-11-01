'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const PinSent = steps.PinSent;

describe('Pin-Sent', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = PinSent.constructor.getUrl();
            expect(url).to.equal('/pin-sent');
            done();
        });
    });

    describe('shouldPersistFormData()', () => {
        it('should return false', () => {
            const persist = PinSent.shouldPersistFormData();
            expect(persist).to.equal(false);
        });
    });
});
