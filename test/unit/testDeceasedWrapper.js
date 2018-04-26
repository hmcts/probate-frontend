const DeceasedWrapper = require('app/wrappers/Deceased');
const commonContent = require('app/resources/en/translation/common');
const chai = require('chai');
const expect = chai.expect;

describe('Deceased.js', () => {
    describe('hasAlias()', () => {
        it('should return true when the deceased has an alias', (done) => {
            const data = {alias: commonContent.yes};
            const deceasedWrapper = new DeceasedWrapper(data);
            expect(deceasedWrapper.hasAlias()).to.equal(true);
            done();
        });

        describe('should return false', () => {
            it('when the deceased does not have an alias', (done) => {
                const data = {alias: commonContent.no};
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
            const data = {married: commonContent.yes};
            const deceasedWrapper = new DeceasedWrapper(data);
            expect(deceasedWrapper.isMarried()).to.equal(true);
            done();
        });

        describe('should return false', () => {
            it('when the deceased is not married', (done) => {
                const data = {married: commonContent.no};
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
