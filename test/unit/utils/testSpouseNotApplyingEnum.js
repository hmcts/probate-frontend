const SpouseNotApplyingEnum = require('app/utils/SpouseNotApplyingEnum');
const content = require('app/resources/en/translation/applicant/spousenotapplyingreason');
const expect = require('chai').expect;

describe('SpouseNotApplyingEnum.js', () => {

    describe('getCCDCode()', () => {
        it('should return renunciated value', (done) => {
            expect(SpouseNotApplyingEnum.getCCDCode(content.optionRenouncing)).to.equal(SpouseNotApplyingEnum.getRenouncing());
            done();
        });
        it('should return other value', (done) => {
            expect(SpouseNotApplyingEnum.getCCDCode(content.optionOther)).to.equal(SpouseNotApplyingEnum.getOther());
            done();
        });
        it('should return unknown value', (done) => {
            expect(() => SpouseNotApplyingEnum.getCCDCode('unknown')).to.throw('Enumerator SpouseNotApplyingEnum value: unknown not found');
            done();
        });
    });

});
