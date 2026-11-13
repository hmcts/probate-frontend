'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const validator = require("validator");
const config = require("config");
const FieldError = require("../../../../components/error");

class ApplicantName extends ValidationStep {

    static getUrl() {
        return '/applicant-name';
    }

    handlePost(ctx, errors, formdata, session) {
        if (ctx.firstName && validator.isURL(ctx.firstName, config.validUrl.options)) {
            errors.push(FieldError('firstName', 'invalid', this.resourcePath, this.generateContent({}, {}, session.language), session.language));

        }
        if (ctx.lastName && validator.isURL(ctx.lastName, config.validUrl.options)) {
            errors.push(FieldError('lastName', 'invalid', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }
        return [ctx, errors];
    }
}

module.exports = ApplicantName;
