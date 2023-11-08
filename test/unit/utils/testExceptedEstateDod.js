'use strict';

const expect = require('chai').expect;

describe('ExceptedEstateDod.js', () => {
    beforeEach(() => {
        delete require.cache[require.resolve('app/utils/ExceptedEstateDod')];
        delete require.cache[require.resolve('config')];
    });

    describe('test', () => {
        it('should return true if dod > threshold ', (done) => {
            const ExceptedEstateDod = require('app/utils/ExceptedEstateDod');
            const date = new Date('2022-01-01').getTime();
            const result = ExceptedEstateDod.afterEeDodThreshold(date);
            expect(result).to.equal(true);
            done();
        });

        it('should return false if dod < threshold ', (done) => {
            const ExceptedEstateDod = require('app/utils/ExceptedEstateDod');
            const date = new Date('2021-01-01').getTime();
            const result = ExceptedEstateDod.afterEeDodThreshold(date);
            expect(result).to.equal(false);
            done();
        });

        it('should return true if dod < threshold ', (done) => {
            const ExceptedEstateDod = require('app/utils/ExceptedEstateDod');
            const date = new Date('2021-01-01').getTime();
            const result = ExceptedEstateDod.beforeEeDodThreshold(date);
            expect(result).to.equal(true);
            done();
        });

        it('should override threshold from env var ', (done) => {
            process.env.EXCEPTED_ESTATE_DATE_OF_DEATH = '2021-01-01';
            const ExceptedEstateDod = require('app/utils/ExceptedEstateDod');
            const date = new Date('2021-06-06').getTime();
            const result = ExceptedEstateDod.afterEeDodThreshold(date);
            expect(result).to.equal(true);
            delete process.env.EXCEPTED_ESTATE_DATE_OF_DEATH;
            done();
        });

    });
});
