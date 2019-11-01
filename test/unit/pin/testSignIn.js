'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const PinPage = steps.PinPage;

describe('Pin-Page', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = PinPage.constructor.getUrl();
            expect(url).to.equal('/sign-in');
            done();
        });
    });

    describe('shouldPersistFormData()', () => {
        it('should return false', () => {
            const persist = PinPage.shouldPersistFormData();
            expect(persist).to.equal(false);
        });
    });
});
