'use strict';

class FormatName {
    static format(person) {
        person = person || {};
        const firstName = person.firstName || '';
        const lastName = person.lastName || '';
        return `${firstName} ${lastName}`.trim();
    }
}

module.exports = FormatName;
