const WillWrapper = require('app/wrappers/Will');
const commonContent = require('app/resources/en/translation/common');
const chai = require('chai');
const expect = chai.expect;

describe('Willgit ', () => {
    describe('hasCodicils()', () => {
        it('should return true when there are codicils', (done) => {
            const data = {codicils: commonContent.yes};
            const willWrapper = new WillWrapper(data);
            expect(willWrapper.hasCodicils()).to.equal(true);
            done();
        });

        it('should return false when there are no codicils', (done) => {
            const data = {codicils: commonContent.no};
            const willWrapper = new WillWrapper(data);
            expect(willWrapper.hasCodicils()).to.equal(false);
            done();
        });

        it('should return false when there is no will data', (done) => {
            const data = {};
            const willWrapper = new WillWrapper(data);
            expect(willWrapper.hasCodicils()).to.equal(false);
            done();
        });
    });

    describe('hasWillDate()', () => {
        it('should return true when there is a will date', (done) => {
            const data = {isWillDate: commonContent.yes};
            const willWrapper = new WillWrapper(data);
            expect(willWrapper.hasWillDate()).to.equal(true);
            done();
        });

        it('should return false when there is no will date', (done) => {
            const data = {isWillDate: commonContent.no};
            const willWrapper = new WillWrapper(data);
            expect(willWrapper.hasWillDate()).to.equal(false);
            done();
        });

        it('should return false when there is no will data', (done) => {
            const data = {};
            const willWrapper = new WillWrapper(data);
            expect(willWrapper.hasWillDate()).to.equal(false);
            done();
        });
    });

    describe('hasCodicilsDate()', () => {
        it('should return true when there is a codicils date', (done) => {
            const data = {isCodicilsDate: commonContent.yes};
            const willWrapper = new WillWrapper(data);
            expect(willWrapper.hasCodicilsDate()).to.equal(true);
            done();
        });

        it('should return false when there is no codicils date', (done) => {
            const data = {isCodicilsDate: commonContent.no};
            const willWrapper = new WillWrapper(data);
            expect(willWrapper.hasCodicilsDate()).to.equal(false);
            done();
        });

        it('should return false when there is no will data', (done) => {
            const data = {};
            const willWrapper = new WillWrapper(data);
            expect(willWrapper.hasCodicilsDate()).to.equal(false);
            done();
        });
    });
});
