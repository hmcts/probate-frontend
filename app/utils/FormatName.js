'use strict';

class NameFormatter {
    static format(person) {
        return (person) ? `${person.firstName} ${person.lastName}` : '';
    }
}

module.exports = NameFormatter;
