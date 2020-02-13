const MaritalStatusEnum = require('app/utils/MaritalStatusEnum');
const expect = require('chai').expect;

describe('MaritalStatusEnum.js', () => {
    describe('getCCDCode()', () => {
        it('should return Widowed value', (done) => {
            expect(MaritalStatusEnum.getCCDCode('optionWidowed')).to.equal(MaritalStatusEnum.getWidowed());
            done();
        });
        it('should return marriedCivilPartnership value', (done) => {
            expect(MaritalStatusEnum.getCCDCode('optionMarried')).to.equal(MaritalStatusEnum.getMarriedCivilPartnerhip());
            done();
        });
        it('should return divorcedCivilPartnership value', (done) => {
            expect(MaritalStatusEnum.getCCDCode('optionDivorced')).to.equal(MaritalStatusEnum.getDivorcedCivilPartnerShip());
            done();
        });
        it('should return judicially value', (done) => {
            expect(MaritalStatusEnum.getCCDCode('optionSeparated')).to.equal(MaritalStatusEnum.getJudicially());
            done();
        });
        it('should return never married value', (done) => {
            expect(MaritalStatusEnum.getCCDCode('optionNotMarried')).to.equal(MaritalStatusEnum.getNeverMarried());
            done();
        });
        it('should return unknown value', (done) => {
            expect(() => MaritalStatusEnum.getCCDCode('unknown')).to.throw('Enumerator MaritalStatusEnum value: unknown not found');
            done();
        });
    });

});
