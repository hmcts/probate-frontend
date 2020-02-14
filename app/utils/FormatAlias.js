'use strict';

class FormatAlias {
    static aliasReason(person, hasMultipleApplicants) {
        person = person || {};
        const aliasReason = person.aliasReason || person.currentNameReason || '';
        const otherReason = person.otherReason ? person.otherReason : '';
        return this.formatAliasReason(aliasReason, otherReason, hasMultipleApplicants) || '';
    }

    static formatAliasReason(aliasReason, otherReason, hasMultipleApplicants) {
        if (aliasReason === 'optionMarriage') {
            return hasMultipleApplicants ? ' got married' : ' I got married';
        } else if (aliasReason === 'optionDivorce') {
            return hasMultipleApplicants ? ' got divorced' : ' I got divorced';
        } else if (aliasReason === 'optionDeedPoll') {
            return hasMultipleApplicants ? ' changed their name by deed poll' : ' I changed my name by deed poll';
        } else if (aliasReason === 'optionOther') {
            return `: ${otherReason}`;
        }
    }
}

module.exports = FormatAlias;
