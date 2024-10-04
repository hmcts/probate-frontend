'use strict';

class FormatAlias {
    static aliasReason(person, hasMultipleApplicants, isExecutorApplicant, executorCurrentName) {
        person = person || {};
        const aliasReason = person.aliasReason || person.currentNameReason || '';
        const otherReason = person.otherReason ? person.otherReason : '';
        return (hasMultipleApplicants ? this.formatMultipleApplicantAliasReason(aliasReason, otherReason,
            isExecutorApplicant, executorCurrentName) : this.formatAliasReason(aliasReason, otherReason,
            isExecutorApplicant)) || '';
    }

    static formatMultipleApplicantAliasReason(aliasReason, otherReason, isExecutorApplicant, executorCurrentName) {
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
        } else if (aliasReason === 'optionOther') {
            return ` ${otherReason}`;
        }
    }

    static formatAliasReason(aliasReason, otherReason, isExecutorApplicant) {
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
        } else if (aliasReason === 'optionOther') {
            return isExecutorApplicant ? `: ${otherReason}` : '';
        }
    }
}

module.exports = FormatAlias;
