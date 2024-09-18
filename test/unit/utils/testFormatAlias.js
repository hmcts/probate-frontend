'use strict';

const FormatAlias = require('app/utils/FormatAlias');
const expect = require('chai').expect;

describe('FormatAlias.js', () => {
    describe('aliasReason()', () => {
        it('should return correctly formatted alias reason when reason is Marriage', (done) => {
            const executor = {firstName: 'James', lastName: 'Miller', alias: 'Bob Alias', aliasReason: 'optionMarriage'};
            expect(FormatAlias.aliasReason(executor, false, true, '')).to.equal(' I got married or formed a civil partnership');
            done();
        });

        it('should return correctly formatted alias reason when reason is Divorce', (done) => {
            const executor = {firstName: 'James', lastName: 'Miller', aliasReason: 'optionDivorce'};
            expect(FormatAlias.aliasReason(executor, false, true, '')).to.equal(' I got divorced or ended my civil partnership');
            done();
        });

        it('should return correctly formatted alias reason when reason is Change by deed poll', (done) => {
            const executor = {firstName: 'James', lastName: 'Miller', aliasReason: 'optionDeedPoll'};
            expect(FormatAlias.aliasReason(executor, false, false, '')).to.equal('');
            done();
        });

        it('should return correctly formatted other reason when reason is other', (done) => {
            const executor = {
                firstName: 'James',
                lastName: 'Miller',
                aliasReason: 'optionOther',
                otherReason: 'because I felt like it'
            };
            expect(FormatAlias.aliasReason(executor, false, true, '')).to.equal(': because I felt like it');
            done();
        });

        it('should return an empty string when no reason is passed', (done) => {
            const executor = {firstName: 'James', lastName: 'Miller'};
            expect(FormatAlias.aliasReason(executor, false, true, '')).to.equal('');
            done();
        });
    });

    describe('formatAliasReason() for multiple applicants', () => {
        it('should return the correct text when Marriage is selected as aliasReason', (done) => {
            const aliasReason = 'optionMarriage';
            expect(FormatAlias.formatMultipleApplicantAliasReason(aliasReason, '', false, '')).to.equal(' They got married or formed a civil partnership');
            done();
        });

        it('should return the correct text when Divorce is selected as aliasReason', (done) => {
            const aliasReason = 'optionDivorce';
            expect(FormatAlias.formatMultipleApplicantAliasReason(aliasReason, '', false, '')).to.equal(' They got divorced or ended their civil partnership');
            done();
        });

        it('should return the correct text when Changed by deed poll is selected as aliasReason', (done) => {
            const aliasReason = 'optionDeedPoll';
            expect(FormatAlias.formatMultipleApplicantAliasReason(aliasReason, '', false, '')).to.equal(' They changed their name by deed poll');
            done();
        });

        it('should return the correct text when Changed by deed poll is selected as aliasReason', (done) => {
            const aliasReason = 'optionDifferentSpelling';
            expect(FormatAlias.formatMultipleApplicantAliasReason(aliasReason, '', false, '')).to.equal(' Their name was spelled differently');
            done();
        });
        it('should return the correct text when Changed by deed poll is selected as aliasReason', (done) => {
            const aliasReason = 'optionPartOfNameNotIncluded';
            expect(FormatAlias.formatMultipleApplicantAliasReason(aliasReason, '', false, '')).to.equal(' Part of their name was not included');
            done();
        });

        it('should return the other reason when other is selected as aliasReason', (done) => {
            const aliasReason = 'optionOther';
            const otherReason = 'because I felt like it';
            expect(FormatAlias.formatMultipleApplicantAliasReason(aliasReason, otherReason, false, '')).to.equal(' because I felt like it');
            done();
        });
        it('should return the correct with executor text when Marriage is selected as aliasReason', (done) => {
            const aliasReason = 'optionMarriage';
            expect(FormatAlias.formatMultipleApplicantAliasReason(aliasReason, '', true, 'Jane Doe')).to.equal(' Jane Doe got married or formed a civil partnership');
            done();
        });

        it('should return the correct with executor text when Divorce is selected as aliasReason', (done) => {
            const aliasReason = 'optionDivorce';
            expect(FormatAlias.formatMultipleApplicantAliasReason(aliasReason, '', true, 'Jane Doe')).to.equal(' Jane Doe got divorced or ended their civil partnership');
            done();
        });

        it('should return the correct with executor text when Changed by deed poll is selected as aliasReason', (done) => {
            const aliasReason = 'optionDeedPoll';
            expect(FormatAlias.formatMultipleApplicantAliasReason(aliasReason, '', true, 'Jane Doe')).to.equal(' Jane Doe changed their name by deed poll');
            done();
        });

        it('should return the correct with executor text when Changed by deed poll is selected as aliasReason', (done) => {
            const aliasReason = 'optionDifferentSpelling';
            expect(FormatAlias.formatMultipleApplicantAliasReason(aliasReason, '', true, 'Jane Doe')).to.equal(' Jane Doe‘s name was spelled differently');
            done();
        });
        it('should return the correct with executor text when Changed by deed poll is selected as aliasReason', (done) => {
            const aliasReason = 'optionPartOfNameNotIncluded';
            expect(FormatAlias.formatMultipleApplicantAliasReason(aliasReason, '', true, 'Jane Doe')).to.equal(' Part of Jane Doe‘s name was not included');
            done();
        });
    });

    describe('formatAliasReason() for single applicant', () => {
        it('should return the correct text when Marriage is selected as aliasReason', (done) => {
            const aliasReason = 'optionMarriage';
            expect(FormatAlias.formatAliasReason(aliasReason, '', true)).to.equal(' I got married or formed a civil partnership');
            done();
        });

        it('should return the correct text when Divorce is selected as aliasReason', (done) => {
            const aliasReason = 'optionDivorce';
            expect(FormatAlias.formatAliasReason(aliasReason, '', true)).to.equal(' I got divorced or ended my civil partnership');
            done();
        });

        it('should return the correct text when Changed by deed poll is selected as aliasReason', (done) => {
            const aliasReason = 'optionDeedPoll';
            expect(FormatAlias.formatAliasReason(aliasReason, '', false)).to.equal('');
            done();
        });

        it('should return the other reason when other is selected as aliasReason', (done) => {
            const aliasReason = 'optionOther';
            const otherReason = 'because I felt like it';
            expect(FormatAlias.formatAliasReason(aliasReason, otherReason, false)).to.equal('');
            done();
        });
    });
});
