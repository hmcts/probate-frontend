'use strict';

const {expect} = require('chai');
const initSteps = require('app/core/initSteps');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

describe('CodicilsNumber unit tests', () => {

    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const codicilsNumber = steps.CodicilsNumber;
            const url = codicilsNumber.constructor.getUrl();
            expect(url).to.equal('/codicils-number');
            done();
        });
    });

    describe('isComplete()', () => {
        it('should return false when is less than 1', (done) => {
            const ctx = {codicilsNumber: -1};
            const codicilsNumber = steps.CodicilsNumber;
            const val = codicilsNumber.isComplete(ctx);
            expect(val).to.deep.equal([false, 'inProgress']);
            done();
        });

        it('should return true when codicilsNumber is 2', (done) => {
            const ctx = {codicilsNumber: 2};
            const codicilsNumber = steps.CodicilsNumber;
            const val = codicilsNumber.isComplete(ctx);
            expect(val).to.deep.equal([true, 'inProgress']);
            done();
        });

        it('should return true when codicilsNumber is 0', (done) => {
            const ctx = {codicilsNumber: 0};
            const codicilsNumber = steps.CodicilsNumber;
            const val = codicilsNumber.isComplete(ctx);
            expect(val).to.deep.equal([true, 'inProgress']);
            done();
        });

    });
});
