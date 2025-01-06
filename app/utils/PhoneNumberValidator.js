const parsePhoneNumber = require('libphonenumber-js/mobile').parsePhoneNumber;

class PhoneNumberValidator {
    static validateMobilePhoneNumber(num) {
        const parsed = parsePhoneNumber(num, 'GB');
        if (parsed) {
            return parsed.isValid();
        }
        return false;
    }
}

module.exports = PhoneNumberValidator;
