const FormatName = require('app/utils/FormatName');
const chai = require('chai');
const expect = chai.expect;

describe('FormatName.js', () => {
    describe('format()', () => {
        it('should return a correctly formatted name when a person is given', (done) => {
            const executor = {firstName: 'James', lastName: 'Miller'};
            expect(FormatName.format(executor)).to.equal('James Miller');
            done();
        });

        it('should return a first name without trailing spaces when only a first name is given', (done) => {
            const executor = {firstName: 'James'};
            expect(FormatName.format(executor)).to.equal('James');
            done();
        });

        it('should return a last name without leading spaces when only a last name is given', (done) => {
            const executor = {lastName: 'Miller'};
            expect(FormatName.format(executor)).to.equal('Miller');
            done();
        });

        it('should return an empty string when a person is not given', (done) => {
            expect(FormatName.format()).to.equal('');
            done();
        });
    });
});
