'use strict';

class FormatName {
    static format(person) {
        person = person || {};
        const firstName = person.firstName || '';
        const lastName = person.lastName || '';
        return `${firstName} ${lastName}`.trim();
    }

    static applicantWillName(person) {
        person = person || {};
        const currentName = person.alias || this.format(person);
        return currentName;
    }

    static formatName(person, useOtherName) {
        if (useOtherName && person.currentName) {
            return person.currentName;
        } else if (person.fullName) {
            return person.fullName;
        }
        return FormatName.format(person);
    }

    static getNameAndAddress(person, contentOf, applicantAddress) {
        const fullName = FormatName.formatName(person, person.hasOtherName);
        let address;
        if (person.isApplicant) {
            address = applicantAddress.formattedAddress;
        } else {
            address = person.address ? person.address.formattedAddress : '';
        }
        return address ? `${fullName} ${contentOf} ${address}` : fullName;
    }

    static formatExecutorNames(executors) {
        const contentAnd = 'and';
        if (executors) {
            const separator = ', ';
            const formattedNames = executors
                .map(executor => executor.fullName)
                .join(separator);
            return this.delimitNames(formattedNames, separator, contentAnd);
        }
    }

    static formatMultipleNamesAndAddress(persons, content, applicantAddress) {
        if (persons) {
            const separator = ', ';
            const formattedNames = Object.keys(persons)
                .map(key => FormatName.getNameAndAddress(persons[key], content.of, applicantAddress))
                .join(separator);
            return FormatName.delimitNames(formattedNames, separator, content.and);
        }
    }

    static delimitNames(formattedNames, separator, contentAnd) {
        const lastCommaPos = formattedNames.lastIndexOf(separator);
        if (lastCommaPos > -1) {
            return `${formattedNames.substring(0, lastCommaPos)} ${contentAnd} ${formattedNames.substring(lastCommaPos + separator.length)}`;
        }
        return formattedNames;
    }
}

module.exports = FormatName;
