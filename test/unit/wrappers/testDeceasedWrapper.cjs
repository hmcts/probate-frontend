'use strict';

const DeceasedWrapper = require('app/wrappers/Deceased.cjs');
const expect = require('chai').expect;

describe('Deceased.js', () => {
    describe('hasAlias()', () => {
        it('should return true when the deceased has an alias', (done) => {
            const data = {alias: 'optionYes'};
            const deceasedWrapper = new DeceasedWrapper(data);
            expect(deceasedWrapper.hasAlias()).to.equal(true);
            done();
        });

        describe('should return false', () => {
            it('when the deceased does not have an alias', (done) => {
                const data = {alias: 'optionNo'};
                const deceasedWrapper = new DeceasedWrapper(data);
                expect(deceasedWrapper.hasAlias()).to.equal(false);
                done();
            });

            it('when there is no deceased data', (done) => {
                const deceasedWrapper = new DeceasedWrapper();
                expect(deceasedWrapper.hasAlias()).to.equal(false);
                done();
            });
        });
    });

    describe('isMarried()', () => {
        it('should return true when the deceased is married', (done) => {
            const data = {married: 'optionYes'};
            const deceasedWrapper = new DeceasedWrapper(data);
            expect(deceasedWrapper.isMarried()).to.equal(true);
            done();
        });

        describe('should return false', () => {
            it('when the deceased is not married', (done) => {
                const data = {married: 'optionNo'};
                const deceasedWrapper = new DeceasedWrapper(data);
                expect(deceasedWrapper.isMarried()).to.equal(false);
                done();
            });

            it('when there is no deceased data', (done) => {
                const deceasedWrapper = new DeceasedWrapper();
                expect(deceasedWrapper.isMarried()).to.equal(false);
                done();
            });
        });
    });
});
