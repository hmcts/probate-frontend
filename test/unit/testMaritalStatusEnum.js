const MaritalStatusEnum = require('app/utils/MaritalStatusEnum');
const content = require('app/resources/en/translation/deceased/maritalstatus');
const expect = require('chai').expect;

describe('MaritalStatusEnum.js', () => {
    describe('getCCDCode()', () => {
        it('should return Widowed value', (done) => {
            expect(MaritalStatusEnum.getCCDCode(content.optionWidowed)).to.equal(MaritalStatusEnum.getWidowed());
            done();
        });
        it('should return marriedCivilPartnership value', (done) => {
            expect(MaritalStatusEnum.getCCDCode(content.optionMarried)).to.equal(MaritalStatusEnum.getMarriedCivilPartnerhip());
            done();
        });
        it('should return divorcedCivilPartnership value', (done) => {
            expect(MaritalStatusEnum.getCCDCode(content.optionDivorced)).to.equal(MaritalStatusEnum.getDivorcedCivilPartnerShip());
            done();
        });
        it('should return judicially value', (done) => {
            expect(MaritalStatusEnum.getCCDCode(content.optionSeparated)).to.equal(MaritalStatusEnum.getJudicially());
            done();
        });
        it('should return never married value', (done) => {
            expect(MaritalStatusEnum.getCCDCode(content.optionNotMarried)).to.equal(MaritalStatusEnum.getNeverMarried());
            done();
        });
        it('should return unknown value', (done) => {
            expect(() => MaritalStatusEnum.getCCDCode('unknown')).to.throw('Enumerator MaritalStatusEnum value: unknown not found');
            done();
        });
    });

});
