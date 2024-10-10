'use strict';

class FormatAlias {
    static aliasReason(person, hasMultipleApplicants, isExecutorApplicant, executorCurrentName, language) {
        person = person || {};
        const aliasReason = person.aliasReason || person.currentNameReason || '';
        const otherReason = person.otherReason ? person.otherReason : '';
        return (hasMultipleApplicants ? this.formatMultipleApplicantAliasReason(aliasReason, otherReason,
            isExecutorApplicant, executorCurrentName, language) : this.formatAliasReason(aliasReason, otherReason,
            isExecutorApplicant, language)) || '';
    }

    static formatMultipleApplicantAliasReason(aliasReason, otherReason, isExecutorApplicant, executorCurrentName, language) {
        if (aliasReason === 'optionOther') {
            return ` ${otherReason}`;
        }
        if (language === 'en') {
            return FormatAlias.englishMultipleAliasReason(aliasReason, isExecutorApplicant, executorCurrentName);
        } else if (language === 'cy') {
            return FormatAlias.welshMultipleAliasReason(aliasReason, isExecutorApplicant, executorCurrentName);
        }
    }

    static formatAliasReason(aliasReason, otherReason, isExecutorApplicant, language) {
        if (aliasReason === 'optionOther') {
            return isExecutorApplicant ? `: ${otherReason}` : '';
        }
        if (language === 'en') {
            return FormatAlias.englishSingleAliasReason(aliasReason, isExecutorApplicant);
        } else if (language === 'cy') {
            return FormatAlias.welshSingleAliasReason(aliasReason, isExecutorApplicant);
        }
    }

    static englishMultipleAliasReason(aliasReason, isExecutorApplicant, executorCurrentName) {
        if (aliasReason === 'optionMarriage') {
            return isExecutorApplicant ? ' ' + executorCurrentName + ' got married or formed a civil partnership' : ' They got married or formed a civil partnership';
        } else if (aliasReason === 'optionDivorce') {
            return isExecutorApplicant ? ' ' + executorCurrentName + ' got divorced or ended their civil partnership' : ' They got divorced or ended their civil partnership';
        } else if (aliasReason === 'optionDeedPoll') {
            return isExecutorApplicant ? ' ' + executorCurrentName + ' changed their name by deed poll' : ' They changed their name by deed poll';
        } else if (aliasReason === 'optionDifferentSpelling') {
            return isExecutorApplicant ? ' ' + executorCurrentName + '‘s name was spelled differently' : ' Their name was spelled differently';
        } else if (aliasReason === 'optionPartOfNameNotIncluded') {
            return isExecutorApplicant ? ' Part of ' + executorCurrentName + '‘s name was not included' : ' Part of their name was not included';
        }
    }

    static welshMultipleAliasReason(aliasReason, isExecutorApplicant, executorCurrentName) {
        if (aliasReason === 'optionMarriage') {
            return isExecutorApplicant ? ' Mae ' + executorCurrentName + ' wedi priodi neu wedi ffurfio partneriaeth sifil' : ' Maent wedi priodi neu wedi ffurfio partneriaeth sifil';
        } else if (aliasReason === 'optionDivorce') {
            return isExecutorApplicant ? ' Mae ' + executorCurrentName + ' wedi ysgaru neu wedi dod â’u partneriaeth sifil i ben' : ' Maent wedi ysgaru neu wedi dod â’u partneriaeth sifil i ben';
        } else if (aliasReason === 'optionDeedPoll') {
            return isExecutorApplicant ? ' Newidiodd ' + executorCurrentName + ' ei henw trwy weithred newid enw' : ' Bu iddynt newid eu henw trwy weithred newid enw';
        } else if (aliasReason === 'optionDifferentSpelling') {
            return isExecutorApplicant ? ' Roedd enw ' + executorCurrentName + ' wedi\'i sillafu\'n wahanol' : ' Cafodd eu henw ei sillafu’n wahanol';
        } else if (aliasReason === 'optionPartOfNameNotIncluded') {
            return isExecutorApplicant ? ' Ni chynhwyswyd rhan o enw ' + executorCurrentName : ' Ni chafodd rhan o’u henw ei gynnwys';
        }
    }

    static englishSingleAliasReason(aliasReason, isExecutorApplicant) {
        if (aliasReason === 'optionMarriage') {
            return isExecutorApplicant ? ' I got married or formed a civil partnership' : '';
        } else if (aliasReason === 'optionDivorce') {
            return isExecutorApplicant ? ' I got divorced or ended my civil partnership': '';
        } else if (aliasReason === 'optionDeedPoll') {
            return isExecutorApplicant ? ' I changed my name by deed poll' : '';
        } else if (aliasReason === 'optionDifferentSpelling') {
            return isExecutorApplicant ? ' My name was spelled differently' : '';
        } else if (aliasReason === 'optionPartOfNameNotIncluded') {
            return isExecutorApplicant ? ' Part of my name was not included' : '';
        }
    }

    static welshSingleAliasReason(aliasReason, isExecutorApplicant) {
        if (aliasReason === 'optionMarriage') {
            return isExecutorApplicant ? ' Bu imi briodi neu ffurfio partneriaeth sifil' : '';
        } else if (aliasReason === 'optionDivorce') {
            return isExecutorApplicant ? ' Cefais ysgariad neu daeth fy mhartneriaeth sifil i ben': '';
        } else if (aliasReason === 'optionDeedPoll') {
            return isExecutorApplicant ? ' Newidiais fy enw trwy weithred newid enw' : '';
        } else if (aliasReason === 'optionDifferentSpelling') {
            return isExecutorApplicant ? ' Cafodd fy enw ei sillafu’n wahanol' : '';
        } else if (aliasReason === 'optionPartOfNameNotIncluded') {
            return isExecutorApplicant ? ' Ni chafodd rhan o fy enw ei gynnwys' : '';
        }
    }
}

module.exports = FormatAlias;
