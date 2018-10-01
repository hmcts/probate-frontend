const FormatAlias = require('app/utils/FormatAlias');
const chai = require('chai');
const expect = chai.expect;

describe('FormatAlias.js', () => {
    describe('aliasReason()', () => {
        it('should return correctly formatted alias reason when reason is Marriage', (done) => {
            const executor = {firstName: 'James', lastName: 'Miller', alias: 'Bob Alias', aliasReason: 'Marriage'};
            expect(FormatAlias.aliasReason(executor)).to.equal('got married');
            done();
        });

        it('should return correctly formatted alias reason when reason is Divorce', (done) => {
            const executor = {firstName: 'James', lastName: 'Miller', aliasReason: 'Divorce'};
            expect(FormatAlias.aliasReason(executor)).to.equal('got divorced');
            done();
        });

        it('should return correctly formatted alias reason when reason is Change by deed poll', (done) => {
            const executor = {firstName: 'James', lastName: 'Miller', aliasReason: 'Change by deed poll'};
            expect(FormatAlias.aliasReason(executor)).to.equal('changed their name by deed poll');
            done();
        });

        it('should return correctly formatted other reason when reason is other', (done) => {
            const executor = {
                firstName: 'James',
                lastName: 'Miller',
                aliasReason: 'other',
                otherReason: 'because I felt like it'
            };
            expect(FormatAlias.aliasReason(executor)).to.equal(': because I felt like it');
            done();
        });

        it('should return an empty string when no reason is passed', (done) => {
            const executor = {firstName: 'James', lastName: 'Miller'};
            expect(FormatAlias.aliasReason(executor)).to.equal('');
            done();
        });
    });

    describe('formatAliasReason()', () => {
        it('should return the correct text when Marriage is selected as aliasReason', (done) => {
            const aliasReason = 'Marriage';
            expect(FormatAlias.formatAliasReason(aliasReason)).to.equal('got married');
            done();
        });

        it('should return the correct text when Divorce is selected as aliasReason', (done) => {
            const aliasReason = 'Divorce';
            expect(FormatAlias.formatAliasReason(aliasReason)).to.equal('got divorced');
            done();
        });

        it('should return the correct text when Changed by deed poll is selected as aliasReason', (done) => {
            const aliasReason = 'Change by deed poll';
            expect(FormatAlias.formatAliasReason(aliasReason)).to.equal('changed their name by deed poll');
            done();
        });

        it('should return the other reason when other is selected as aliasReason', (done) => {
            const aliasReason = 'other';
            const otherReason = 'because I felt like it';
            expect(FormatAlias.formatAliasReason(aliasReason, otherReason)).to.equal(': because I felt like it');
            done();
        });
    });
});
