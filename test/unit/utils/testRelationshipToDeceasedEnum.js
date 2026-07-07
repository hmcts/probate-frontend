const RelationshipToDeceasedEnum = require('app/utils/RelationshipToTheDeceasedEnum');
const expect = require('chai').expect;

describe('RelationshipToDeceasedEnum.js', () => {
    describe('getCCDCode()', () => {
        it('should return partner value', (done) => {
            expect(RelationshipToDeceasedEnum.getCCDCode('optionSpousePartner')).to.equal(RelationshipToDeceasedEnum.getPartner());
            done();
        });
        it('should return marriedCivilPartnership value', (done) => {
            expect(RelationshipToDeceasedEnum.getCCDCode('optionChild')).to.equal(RelationshipToDeceasedEnum.getChild());
            done();
        });
        it('should return divorcedCivilPartnership value', (done) => {
            expect(RelationshipToDeceasedEnum.getCCDCode('optionAdoptedChild')).to.equal(RelationshipToDeceasedEnum.getAdoptedChild());
            done();
        });
        it('should return judicially value', (done) => {
            expect(RelationshipToDeceasedEnum.getCCDCode('optionOther')).to.equal(RelationshipToDeceasedEnum.getOther());
            done();
        });
        it('should return unknown value', (done) => {
            expect(() => RelationshipToDeceasedEnum.getCCDCode('unknown')).to.throw('Enumerator RelationshipToDeceasedEnum value: unknown not found');
            done();
        });
    });
    describe('mapOptionToValue()', () => {
        it('should return optionSibling value', (done) => {
            expect(RelationshipToDeceasedEnum.mapOptionToValue('optionSibling', 'en')).to.equal('half-blood/whole blood sibling');
            done();
        });
        it('should return optionSibling welsh value', (done) => {
            expect(RelationshipToDeceasedEnum.mapOptionToValue('optionSibling')).to.equal('hanner brawd neu chwaer/brawd neu chwaer cyflawn');
            done();
        });
    });

});
