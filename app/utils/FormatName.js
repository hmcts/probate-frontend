'use strict';

class FormatName {
    static format(person) {
        person = person || {};
        const firstName = person.firstName || '';
        const lastName = person.lastName || '';
        return `${firstName} ${lastName}`.trim();
    }

    static currentName(person) {
        person = person || {};
        const currentName = person.alias || this.format(person);
        return currentName;
    }
}

module.exports = FormatName;
