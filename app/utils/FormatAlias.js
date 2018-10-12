'use strict';

class FormatAlias {
    static aliasReason(person) {
        person = person || {};
        const aliasReason = person.aliasReason || person.currentNameReason || '';
        const otherReason = person.otherReason ? person.otherReason : '';
        return this.formatAliasReason(aliasReason, otherReason) || '';
    }

    static formatAliasReason(aliasReason, otherReason) {
        if (aliasReason === 'Marriage') {
            return ' got married';
        } else if (aliasReason === 'Divorce') {
            return ' got divorced';
        } else if (aliasReason === 'Change by deed poll') {
            return ' changed their name by deed poll';
        } else if (aliasReason === 'other') {
            return `: ${otherReason}`;
        }
    }
}

module.exports = FormatAlias;
