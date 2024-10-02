'use strict';

class FormatAlias {
    static aliasReason(person, hasMultipleApplicants, isBilingual) {
        person = person || {};
        const aliasReason = person.aliasReason || person.currentNameReason || '';
        const otherReason = person.otherReason ? person.otherReason : '';
        return this.formatAliasReason(aliasReason, otherReason, hasMultipleApplicants, isBilingual) || '';
    }

    // eslint-disable-next-line complexity
    static formatAliasReason(aliasReason, otherReason, hasMultipleApplicants, isBilingual) {
        if (aliasReason === 'optionOther') {
            return `: ${otherReason}`;
        }
        if (!isBilingual) {
            if (aliasReason === 'optionMarriage') {
                return hasMultipleApplicants ? ' they got married or formed a civil partnership' : ' I got married or formed a civil partnership';
            } else if (aliasReason === 'optionDivorce') {
                return hasMultipleApplicants ? ' they got divorced or ended their civil partnership' : ' I got divorced or ended a civil partnership';
            } else if (aliasReason === 'optionDeedPoll') {
                return hasMultipleApplicants ? ' they changed their name by deed poll' : ' I changed my name by deed poll';
            } else if (aliasReason === 'optionSpelling') {
                return hasMultipleApplicants ? ' their name was spelled differently' : ' My name was was spelled differently';
            } else if (aliasReason === 'optionNameNotIncluded') {
                return hasMultipleApplicants ? ' part of their name was not included' : ' Part of my name was not included';
            }
        } else if (isBilingual) {
            if (aliasReason === 'optionMarriage') {
                return hasMultipleApplicants ? ' maent wedi priodi neu wedi ffurfio partneriaeth sifil' : ' Bu imi briodi neu ffurfio partneriaeth sifil';
            } else if (aliasReason === 'optionDivorce') {
                return hasMultipleApplicants ? ' maent wedi ysgaru neu wedi dod â’u partneriaeth sifil i ben' : ' Cefais ysgariad neu daeth fy mhartneriaeth sifil i ben';
            } else if (aliasReason === 'optionDeedPoll') {
                return hasMultipleApplicants ? ' bu iddynt newid eu henw trwy weithred newid enw' : ' Newidiais fy enw trwy weithred newid enw';
            } else if (aliasReason === 'optionSpelling') {
                return hasMultipleApplicants ? ' cafodd eu henw ei sillafu’n wahanol' : ' Cafodd fy enw ei sillafu’n wahanol';
            } else if (aliasReason === 'optionNameNotIncluded') {
                return hasMultipleApplicants ? ' ni gafodd rhan o’u henw ei chynnwys' : ' Ni chafodd rhan o fy enw ei gynnwys';
            }
        }
    }
}

module.exports = FormatAlias;
