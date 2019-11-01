'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const PinResend = steps.PinResend;

describe('Pin-Resend', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = PinResend.constructor.getUrl();
            expect(url).to.equal('/pin-resend');
            done();
        });
    });

    describe('shouldPersistFormData()', () => {
        it('should return false', () => {
            const persist = PinResend.shouldPersistFormData();
            expect(persist).to.equal(false);
        });
    });
});
