const IhtThreshold = require('app/utils/IhtThreshold');
const expect = require('chai').expect;

describe('IhtThreshold.js', () => {
    describe('getIhtThreshold()', () => {
        it('should return the correct IHT threshold for dates before 1 Oct 2014', (done) => {
            const date = '2014-09-30';
            expect(IhtThreshold.getIhtThreshold(date)).to.equal(null);
            done();
        });

        it('should return the correct IHT threshold for date equal to 1 Oct 2014', (done) => {
            const date = '2014-10-01';
            expect(IhtThreshold.getIhtThreshold(date)).to.equal(250000);
            done();
        });

        it('should return the correct IHT threshold for dates between 1 Oct 2014 and 5 Feb 2020', (done) => {
            const date = '2018-04-18';
            expect(IhtThreshold.getIhtThreshold(date)).to.equal(250000);
            done();
        });

        it('should return the correct IHT threshold for date equal to 5 Feb 2020', (done) => {
            const date = '2020-02-05';
            expect(IhtThreshold.getIhtThreshold(date)).to.equal(250000);
            done();
        });

        it('should return the correct IHT threshold for date equal to 6 Feb 2020', (done) => {
            const date = '2020-02-06';
            expect(IhtThreshold.getIhtThreshold(date)).to.equal(270000);
            done();
        });

        it('should return the correct IHT threshold for dates after 6 Feb 2020', (done) => {
            const date = '2025-08-04';
            expect(IhtThreshold.getIhtThreshold(date)).to.equal(270000);
            done();
        });
    });
});
