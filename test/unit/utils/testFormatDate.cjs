'use strict';

const FormatDate = require('app/utils/FormatDate');
const expect = require('chai').expect;

describe('FormatDate.js', () => {
    describe('addWeeksToDate', () => {
        it('should add 7 weeks to a normal date', (done) => {
            const inputDate = '2024-01-01';
            const weeksToAdd = 7;
            const expectedDate = '2024-02-19';
            expect(FormatDate.addWeeksToDate(inputDate, weeksToAdd)).to.equal(expectedDate);
            done();
        });

        it('should add 7 weeks to a leap year date (Feb 29)', (done) => {
            const inputDate = '2024-02-29';
            const weeksToAdd = 7;
            const expectedDate = '2024-04-18';
            expect(FormatDate.addWeeksToDate(inputDate, weeksToAdd)).to.equal(expectedDate);
            done();
        });

        it('should add 7 weeks to the end of the year date', (done) => {
            const inputDate = '2024-12-01';
            const weeksToAdd = 7;
            const expectedDate = '2025-01-19';
            expect(FormatDate.addWeeksToDate(inputDate, weeksToAdd)).to.equal(expectedDate);
            done();
        });

        it('should handle negative weeks correctly', (done) => {
            const inputDate = '2024-03-01';
            const weeksToAdd = -7;
            const expectedDate = '2024-01-12';
            expect(FormatDate.addWeeksToDate(inputDate, weeksToAdd)).to.equal(expectedDate);
            done();
        });
    });
});
