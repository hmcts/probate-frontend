const WillWrapper = require('app/wrappers/Will');
const commonContent = require('app/resources/en/translation/common');
const expect = require('chai').expect;

describe('Will', () => {
    describe('hasCodicils()', () => {
        it('should return true when there are codicils', (done) => {
            const data = {codicils: commonContent.yes};
            const willWrapper = new WillWrapper(data);
            expect(willWrapper.hasCodicils()).to.equal(true);
            done();
        });

        describe('should return false', () => {
            it('when there are no codicils', (done) => {
                const data = {codicils: commonContent.no};
                const willWrapper = new WillWrapper(data);
                expect(willWrapper.hasCodicils()).to.equal(false);
                done();
            });

            it('when there is no codicils property', (done) => {
                const data = {};
                const willWrapper = new WillWrapper(data);
                expect(willWrapper.hasCodicils()).to.equal(false);
                done();
            });

            it('when there is no will data', (done) => {
                const willWrapper = new WillWrapper();
                expect(willWrapper.hasCodicils()).to.equal(false);
                done();
            });
        });
    });
    describe('codicilsNumber()', () => {
        it('should return the number of codicils when there is a codicils number', (done) => {
            const data = {codicilsNumber: 2};
            const willWrapper = new WillWrapper(data);
            expect(willWrapper.codicilsNumber()).to.equal(2);
            done();
        });

        describe('should return 0', () => {
            it('when there is no codicilsNumber property', (done) => {
                const data = {};
                const willWrapper = new WillWrapper(data);
                expect(willWrapper.codicilsNumber()).to.equal(0);
                done();
            });

            it('when there is no will data', (done) => {
                const willWrapper = new WillWrapper();
                expect(willWrapper.codicilsNumber()).to.equal(0);
                done();
            });
        });
    });
});
