'use strict';

class FormatAlias {
    static aliasReason(person, hasMultipleApplicants, language) {
        person = person || {};
        const aliasReason = person.aliasReason || person.currentNameReason || '';
        const otherReason = person.otherReason ? person.otherReason : '';
        return (this.formatAliasReason(aliasReason, otherReason, language, hasMultipleApplicants) || '');
    }

    // eslint-disable-next-line complexity
    static formatAliasReason(aliasReason, otherReason, language, hasMultipleApplicants) {
        if (aliasReason === 'optionOther') {
            return ` ${otherReason}`;
        }
        if (language === 'en') {
            if (aliasReason === 'optionMarriage') {
                return hasMultipleApplicants ? ' They got married or formed a civil partnership' : ' I got married or formed a civil partnership';
            } else if (aliasReason === 'optionDivorce') {
                return hasMultipleApplicants ? ' They got divorced or ended their civil partnership' : ' I got divorced or ended my civil partnership';
            } else if (aliasReason === 'optionDeedPoll') {
                return hasMultipleApplicants ? ' They changed their name by deed poll' : ' I changed my name by deed poll';
            } else if (aliasReason === 'optionDifferentSpelling') {
                return hasMultipleApplicants ? ' Their name was spelled differently' : ' My name was spelled differently';
            } else if (aliasReason === 'optionPartOfNameNotIncluded') {
                return hasMultipleApplicants ? ' Part of their name was not included' : ' Part of my name was not included';
            }
        } else if (language === 'cy') {
            if (aliasReason === 'optionMarriage') {
                return hasMultipleApplicants ? ' Maent wedi priodi neu wedi ffurfio partneriaeth sifil' : ' Bu imi briodi neu ffurfio partneriaeth sifil';
            } else if (aliasReason === 'optionDivorce') {
                return hasMultipleApplicants ? ' Maent wedi ysgaru neu wedi dod â’u partneriaeth sifil i ben' : ' Cefais ysgariad neu daeth fy mhartneriaeth sifil i ben';
            } else if (aliasReason === 'optionDeedPoll') {
                return hasMultipleApplicants ? ' Bu iddynt newid eu henw trwy weithred newid enw' : ' Newidiais fy enw trwy weithred newid enw';
            } else if (aliasReason === 'optionDifferentSpelling') {
                return hasMultipleApplicants ? ' Cafodd eu henw ei sillafu’n wahanol' : ' Cafodd fy enw ei sillafu’n wahanol';
            } else if (aliasReason === 'optionPartOfNameNotIncluded') {
                return hasMultipleApplicants ? ' Ni chafodd rhan o’u henw ei gynnwys' : ' Ni chafodd rhan o fy enw ei gynnwys';
            }
        }
    }
}

module.exports = FormatAlias;
