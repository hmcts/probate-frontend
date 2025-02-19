const parsePhoneNumber = require('libphonenumber-js/mobile').parsePhoneNumber;

class PhoneNumberValidator {
    static validateMobilePhoneNumber(phoneNumber) {
        try {
            const parsedPhoneNumber = parsePhoneNumber(phoneNumber, 'GB');
            if (parsedPhoneNumber && parsedPhoneNumber.isValid()) {
                return {isValid: true};
            }
            return {isValid: false, errorType: 'invalid'};
        } catch (error) {
            return {isValid: false, errorType: 'invalid'};
        }
    }
}

module.exports = PhoneNumberValidator;
