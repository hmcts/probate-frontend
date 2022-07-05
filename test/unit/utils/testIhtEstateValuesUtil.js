const IhtEstateValuesUtil = require('app/utils/IhtEstateValuesUtil');
const expect = require('chai').expect;

describe('IhtEstateValuesUtil.js', () => {
    describe('getIhtEstateValuesUtil()', () => {
        it('should be within range', (done) => {
            const value = 500000;
            expect(IhtEstateValuesUtil.withinRange(value)).to.equal(true);
            done();
        });
        it('should not be within range', (done) => {
            const value = 100000;
            expect(IhtEstateValuesUtil.withinRange(value)).to.equal(false);
            done();
        });
        it('should be positive integer', (done) => {
            const value = '100000';
            expect(IhtEstateValuesUtil.isPositiveInteger(value)).to.equal(true);
            done();
        });
        it('should be zero integer', (done) => {
            const value = '0';
            expect(IhtEstateValuesUtil.isPositiveInteger(value)).to.equal(true);
            done();
        });
        it('should not be positive integer', (done) => {
            const value = '-1';
            expect(IhtEstateValuesUtil.isPositiveInteger(value)).to.equal(false);
            done();
        });
        it('should not be positive integer decimal', (done) => {
            const value = '1.10';
            expect(IhtEstateValuesUtil.isPositiveInteger(value)).to.equal(false);
            done();
        });
        it('should not be positive integer decimal - zero pence', (done) => {
            const value = '1.00';
            expect(IhtEstateValuesUtil.isPositiveInteger(value)).to.equal(false);
            done();
        });
        it('should not be positive integer comma', (done) => {
            const value = '1,000';
            expect(IhtEstateValuesUtil.isPositiveInteger(value)).to.equal(false);
            done();
        });
        it('should not be positive integer comma decimal', (done) => {
            const value = '1,000.00';
            expect(IhtEstateValuesUtil.isPositiveInteger(value)).to.equal(false);
            done();
        });
    });
});
