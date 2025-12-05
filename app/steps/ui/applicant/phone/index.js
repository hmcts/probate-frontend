'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const PhoneNumberValidator = require('../../../../utils/PhoneNumberValidator');
const FieldError = require('../../../../components/error');

class ApplicantPhone extends ValidationStep {

    static getUrl() {
        return '/applicant-phone';
    }

    handlePost(ctx, errors, formdata, session) {
        const applicantPhoneNumber = ApplicantPhone.sanitisePhoneNumber(ctx.phoneNumber);

        const validationResult = PhoneNumberValidator.validateMobilePhoneNumber(applicantPhoneNumber);
        if (!validationResult.isValid) {
            errors.push(FieldError('phoneNumber', validationResult.errorType, this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }

        return [ctx, errors];
    }

    static sanitisePhoneNumber(phoneNumber) {
        phoneNumber = String(phoneNumber).trim();
        const plusBeforeDigits = (/^\D*\+/).test(phoneNumber);
        const digitsOnly = phoneNumber.replace(/\D/g, '');
        return plusBeforeDigits ? '+' + digitsOnly : digitsOnly;
    }
}

module.exports = ApplicantPhone;
