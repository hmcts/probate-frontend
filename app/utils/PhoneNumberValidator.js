const parsePhoneNumber = require('libphonenumber-js/mobile').parsePhoneNumber;

class PhoneNumberValidator {
    static validateMobilePhoneNumber(num) {
        try {
            const parsed = parsePhoneNumber(num, 'GB');
            if (parsed) {
                return parsed.isValid();
            }
        } catch (e) {
            return false;
        }
        return false;
    }
}

module.exports = PhoneNumberValidator;
