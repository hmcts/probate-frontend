const AssetsThreshold = require('app/utils/AssetsThreshold');
const expect = require('chai').expect;

describe('AssetsThreshold.js', () => {
    describe('getAssetsThreshold()', () => {
        it('should return the correct assets threshold for dates before 1 Oct 2014', (done) => {
            const date = '2014-09-30';
            expect(AssetsThreshold.getAssetsThreshold(date)).to.equal(null);
            done();
        });

        it('should return the correct assets threshold for date equal to 1 Oct 2014', (done) => {
            const date = '2014-10-01';
            expect(AssetsThreshold.getAssetsThreshold(date)).to.equal(250000);
            done();
        });

        it('should return the correct assets threshold for dates between 1 Oct 2014 and 5 Feb 2020', (done) => {
            const date = '2018-04-18';
            expect(AssetsThreshold.getAssetsThreshold(date)).to.equal(250000);
            done();
        });

        it('should return the correct assets threshold for date equal to 5 Feb 2020', (done) => {
            const date = '2020-02-05';
            expect(AssetsThreshold.getAssetsThreshold(date)).to.equal(250000);
            done();
        });

        it('should return the correct assets threshold for date equal to 6 Feb 2020', (done) => {
            const date = '2020-02-06';
            expect(AssetsThreshold.getAssetsThreshold(date)).to.equal(270000);
            done();
        });

        it('should return the correct assets threshold for dates after 6 Feb 2020 and before 25 July 2023', (done) => {
            const date = '2023-02-04';
            expect(AssetsThreshold.getAssetsThreshold(date)).to.equal(270000);
            done();
        });

        it('should return the correct assets threshold for date on 25 July 2023', (done) => {
            const date = '2023-07-25';
            expect(AssetsThreshold.getAssetsThreshold(date)).to.equal(270000);
            done();
        });

        it('should return the correct assets threshold for dates on 26 July 2023', (done) => {
            const date = '2023-07-26';
            expect(AssetsThreshold.getAssetsThreshold(date)).to.equal(322000);
            done();
        });

        it('should return the correct assets threshold for dates after 26 July 2023', (done) => {
            const date = '2025-07-27';
            expect(AssetsThreshold.getAssetsThreshold(date)).to.equal(322000);
            done();
        });
    });
});
