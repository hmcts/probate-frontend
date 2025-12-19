'use strict';

const FormatAlias = require('app/utils/FormatAlias');
const expect = require('chai').expect;

describe('FormatAlias.js', () => {
    describe('aliasReason()', () => {
        it('should return correctly formatted alias reason when reason is Marriage', (done) => {
            const executor = {firstName: 'James', lastName: 'Miller', alias: 'Bob Alias', aliasReason: 'optionMarriage'};
            expect(FormatAlias.aliasReason(executor, false, 'en')).to.equal(' I got married or formed a civil partnership');
            done();
        });

        it('should return correctly formatted alias reason when reason is Divorce', (done) => {
            const executor = {firstName: 'James', lastName: 'Miller', aliasReason: 'optionDivorce'};
            expect(FormatAlias.aliasReason(executor, false, 'en')).to.equal(' I got divorced or ended my civil partnership');
            done();
        });

        it('should return correctly formatted alias reason when reason is Change by deed poll', (done) => {
            const executor = {firstName: 'James', lastName: 'Miller', aliasReason: 'optionDeedPoll'};
            expect(FormatAlias.aliasReason(executor, false, 'en')).to.equal(' I changed my name by deed poll');
            done();
        });

        it('should return correctly formatted other reason when reason is other', (done) => {
            const executor = {
                firstName: 'James',
                lastName: 'Miller',
                aliasReason: 'optionOther',
                otherReason: 'because I felt like it'
            };
            expect(FormatAlias.aliasReason(executor, false, 'en')).to.equal(' because I felt like it');
            done();
        });

        it('should return an empty string when no reason is passed', (done) => {
            const executor = {firstName: 'James', lastName: 'Miller'};
            expect(FormatAlias.aliasReason(executor, false, 'en')).to.equal('');
            done();
        });
    });

    describe('formatAliasReason() for multiple applicants', () => {
        it('should return the correct text when Marriage is selected as aliasReason', (done) => {
            const aliasReason = 'optionMarriage';
            expect(FormatAlias.formatAliasReason(aliasReason, '', 'en', true)).to.equal(' They got married or formed a civil partnership');
            done();
        });

        it('should return the correct text when Divorce is selected as aliasReason', (done) => {
            const aliasReason = 'optionDivorce';
            expect(FormatAlias.formatAliasReason(aliasReason, '', 'en', true)).to.equal(' They got divorced or ended their civil partnership');
            done();
        });

        it('should return the correct text when Changed by deed poll is selected as aliasReason', (done) => {
            const aliasReason = 'optionDeedPoll';
            expect(FormatAlias.formatAliasReason(aliasReason, '', 'en', true)).to.equal(' They changed their name by deed poll');
            done();
        });

        it('should return the correct text when Changed by deed poll is selected as aliasReason', (done) => {
            const aliasReason = 'optionDifferentSpelling';
            expect(FormatAlias.formatAliasReason(aliasReason, '', 'en', true)).to.equal(' Their name was spelled differently');
            done();
        });
        it('should return the correct text when Changed by deed poll is selected as aliasReason', (done) => {
            const aliasReason = 'optionPartOfNameNotIncluded';
            expect(FormatAlias.formatAliasReason(aliasReason, '', 'en', true)).to.equal(' Part of their name was not included');
            done();
        });

        it('should return the other reason when other is selected as aliasReason', (done) => {
            const aliasReason = 'optionOther';
            const otherReason = 'because I felt like it';
            expect(FormatAlias.formatAliasReason(aliasReason, otherReason, 'en', true)).to.equal(' because I felt like it');
            done();
        });
        it('should return the correct with executor text when Marriage is selected as aliasReason', (done) => {
            const aliasReason = 'optionMarriage';
            expect(FormatAlias.formatAliasReason(aliasReason, '', 'en', true)).to.equal(' They got married or formed a civil partnership');
            done();
        });

        it('should return the correct with executor text when Divorce is selected as aliasReason', (done) => {
            const aliasReason = 'optionDivorce';
            expect(FormatAlias.formatAliasReason(aliasReason, '', 'en', true)).to.equal(' They got divorced or ended their civil partnership');
            done();
        });

        it('should return the correct with executor text when Changed by deed poll is selected as aliasReason', (done) => {
            const aliasReason = 'optionDeedPoll';
            expect(FormatAlias.formatAliasReason(aliasReason, '', 'en', true)).to.equal(' They changed their name by deed poll');
            done();
        });

        it('should return the correct with executor text when Changed by deed poll is selected as aliasReason', (done) => {
            const aliasReason = 'optionDifferentSpelling';
            expect(FormatAlias.formatAliasReason(aliasReason, '', 'en', true)).to.equal(' Their name was spelled differently');
            done();
        });
        it('should return the correct with executor text when Changed by deed poll is selected as aliasReason', (done) => {
            const aliasReason = 'optionPartOfNameNotIncluded';
            expect(FormatAlias.formatAliasReason(aliasReason, '', 'en', true)).to.equal(' Part of their name was not included');
            done();
        });
    });

    describe('formatAliasReason() for single applicant', () => {
        it('should return the correct text when Marriage is selected as aliasReason', (done) => {
            const aliasReason = 'optionMarriage';
            expect(FormatAlias.formatAliasReason(aliasReason, '', 'en', false)).to.equal(' I got married or formed a civil partnership');
            done();
        });

        it('should return the correct text when Divorce is selected as aliasReason', (done) => {
            const aliasReason = 'optionDivorce';
            expect(FormatAlias.formatAliasReason(aliasReason, '', 'en', false)).to.equal(' I got divorced or ended my civil partnership');
            done();
        });

        it('should return the correct text when Changed by deed poll is selected as aliasReason', (done) => {
            const aliasReason = 'optionDeedPoll';
            expect(FormatAlias.formatAliasReason(aliasReason, '', 'en', false)).to.equal(' I changed my name by deed poll');
            done();
        });

        it('should return the other reason when other is selected as aliasReason', (done) => {
            const aliasReason = 'optionOther';
            const otherReason = 'because I felt like it';
            expect(FormatAlias.formatAliasReason(aliasReason, otherReason, 'en', false)).to.equal(' because I felt like it');
            done();
        });
    });
    describe('Welsh FormatAlias.js', () => {
        describe('Welsh aliasReason()', () => {
            it('Welsh - should return correctly formatted alias reason when reason is Marriage', (done) => {
                const executor = {
                    firstName: 'James',
                    lastName: 'Miller',
                    alias: 'Bob Alias',
                    aliasReason: 'optionMarriage'
                };
                expect(FormatAlias.aliasReason(executor, false, 'cy')).to.equal(' Bu imi briodi neu ffurfio partneriaeth sifil');
                done();
            });
            it('Welsh - should return correctly formatted alias reason when reason is Divorce', (done) => {
                const executor = {firstName: 'James', lastName: 'Miller', aliasReason: 'optionDivorce'};
                expect(FormatAlias.aliasReason(executor, false, 'cy')).to.equal(' Cefais ysgariad neu daeth fy mhartneriaeth sifil i ben');
                done();
            });

            it('Welsh - should return correctly formatted alias reason when reason is Change by deed poll', (done) => {
                const executor = {firstName: 'James', lastName: 'Miller', aliasReason: 'optionDeedPoll'};
                expect(FormatAlias.aliasReason(executor, false, 'cy')).to.equal(' Newidiais fy enw trwy weithred newid enw');
                done();
            });

            it('Welsh - should return correctly formatted other reason when reason is other', (done) => {
                const executor = {
                    aliasReason: 'optionOther',
                    otherReason: 'Penderfynais fy mod yn anghyflawn heb fod fy enw yn Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch'
                };
                expect(FormatAlias.aliasReason(executor, false, 'cy')).to.equal(' Penderfynais fy mod yn anghyflawn heb fod fy enw yn Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch');
                done();
            });

            it('should return an empty string when no reason is passed', (done) => {
                const executor = {firstName: 'James', lastName: 'Miller'};
                expect(FormatAlias.aliasReason(executor, false, 'cy')).to.equal('');
                done();
            });
        });
        describe('Welsh formatAliasReason() for multiple applicants', () => {
            it('Welsh - should return the correct text when Marriage is selected as aliasReason', (done) => {
                const aliasReason = 'optionMarriage';
                expect(FormatAlias.formatAliasReason(aliasReason, '', 'cy', true)).to.equal(' Maent wedi priodi neu wedi ffurfio partneriaeth sifil');
                done();
            });

            it('Welsh - should return the correct text when Divorce is selected as aliasReason', (done) => {
                const aliasReason = 'optionDivorce';
                expect(FormatAlias.formatAliasReason(aliasReason, '', 'cy', true)).to.equal(' Maent wedi ysgaru neu wedi dod â’u partneriaeth sifil i ben');
                done();
            });

            it('Welsh - should return the correct text when Changed by deed poll is selected as aliasReason', (done) => {
                const aliasReason = 'optionDeedPoll';
                expect(FormatAlias.formatAliasReason(aliasReason, '', 'cy', true)).to.equal(' Bu iddynt newid eu henw trwy weithred newid enw');
                done();
            });

            it('Welsh - should return the correct text when Changed by deed poll is selected as aliasReason', (done) => {
                const aliasReason = 'optionDifferentSpelling';
                expect(FormatAlias.formatAliasReason(aliasReason, '', 'cy', true)).to.equal(' Cafodd eu henw ei sillafu’n wahanol');
                done();
            });
            it('Welsh - should return the correct text when Changed by deed poll is selected as aliasReason', (done) => {
                const aliasReason = 'optionPartOfNameNotIncluded';
                expect(FormatAlias.formatAliasReason(aliasReason, '', 'cy', true)).to.equal(' Ni chafodd rhan o’u henw ei gynnwys');
                done();
            });

            it('Welsh - should return the other reason when other is selected as aliasReason', (done) => {
                const aliasReason = 'optionOther';
                const otherReason = 'because I felt like it';
                expect(FormatAlias.formatAliasReason(aliasReason, otherReason, 'cy')).to.equal(' because I felt like it');
                done();
            });
            it('Welsh - should return the correct with executor text when Marriage is selected as aliasReason', (done) => {
                const aliasReason = 'optionMarriage';
                expect(FormatAlias.formatAliasReason(aliasReason, '', 'cy', true)).to.equal(' Maent wedi priodi neu wedi ffurfio partneriaeth sifil');
                done();
            });

            it('Welsh - should return the correct with executor text when Divorce is selected as aliasReason', (done) => {
                const aliasReason = 'optionDivorce';
                expect(FormatAlias.formatAliasReason(aliasReason, '', 'cy', true)).to.equal(' Maent wedi ysgaru neu wedi dod â’u partneriaeth sifil i ben');
                done();
            });

            it('Welsh - should return the correct with executor text when Changed by deed poll is selected as aliasReason', (done) => {
                const aliasReason = 'optionDeedPoll';
                expect(FormatAlias.formatAliasReason(aliasReason, '', 'cy', true)).to.equal(' Bu iddynt newid eu henw trwy weithred newid enw');
                done();
            });

            it('Welsh - should return the correct with executor text when Changed by deed poll is selected as aliasReason', (done) => {
                const aliasReason = 'optionDifferentSpelling';
                expect(FormatAlias.formatAliasReason(aliasReason, '', 'cy', true)).to.equal(' Cafodd eu henw ei sillafu’n wahanol');
                done();
            });
            it('Welsh - should return the correct with executor text when Changed by deed poll is selected as aliasReason', (done) => {
                const aliasReason = 'optionPartOfNameNotIncluded';
                expect(FormatAlias.formatAliasReason(aliasReason, '', 'cy', true)).to.equal(' Ni chafodd rhan o’u henw ei gynnwys');
                done();
            });
        });

        describe('Welsh - formatAliasReason() for single applicant', () => {
            it('Welsh - should return the correct text when Marriage is selected as aliasReason', (done) => {
                const aliasReason = 'optionMarriage';
                expect(FormatAlias.formatAliasReason(aliasReason, '', 'cy', false)).to.equal(' Bu imi briodi neu ffurfio partneriaeth sifil');
                done();
            });

            it('Welsh - should return the correct text when Divorce is selected as aliasReason', (done) => {
                const aliasReason = 'optionDivorce';
                expect(FormatAlias.formatAliasReason(aliasReason, '', 'cy', false)).to.equal(' Cefais ysgariad neu daeth fy mhartneriaeth sifil i ben');
                done();
            });

            it('Welsh - should return the correct text when Changed by deed poll is selected as aliasReason', (done) => {
                const aliasReason = 'optionDeedPoll';
                expect(FormatAlias.formatAliasReason(aliasReason, '', 'cy', false)).to.equal(' Newidiais fy enw trwy weithred newid enw');
                done();
            });

            it('Welsh - should return the other reason when other is selected as aliasReason', (done) => {
                const aliasReason = 'optionOther';
                const otherReason = 'because I felt like it';
                expect(FormatAlias.formatAliasReason(aliasReason, otherReason, 'cy', false)).to.equal(' because I felt like it');
                done();
            });
        });
    });
});
