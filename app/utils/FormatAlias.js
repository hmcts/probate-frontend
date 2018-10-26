'use strict';

class FormatAlias {
    static aliasReason(person, hasMultipleApplicants) {
        person = person || {};
        const aliasReason = person.aliasReason || person.currentNameReason || '';
        const otherReason = person.otherReason ? person.otherReason : '';
        return this.formatAliasReason(aliasReason, otherReason, hasMultipleApplicants) || '';
    }

    static formatAliasReason(aliasReason, otherReason, hasMultipleApplicants) {
        if (aliasReason === 'Marriage') {
            return hasMultipleApplicants ? ' got married' : ' I got married';
        } else if (aliasReason === 'Divorce') {
            return hasMultipleApplicants ? ' got divorced' : ' I got divorced';
        } else if (aliasReason === 'Change by deed poll') {
            return hasMultipleApplicants ? ' changed their name by deed poll' : ' I changed my name by deed poll';
        } else if (aliasReason === 'other') {
            return `: ${otherReason}`;
        }
    }
}

module.exports = FormatAlias;
