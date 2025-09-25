'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const FieldError = require("../../../../components/error");

class ApplicantName extends ValidationStep {

    static getUrl() {
        return '/applicant-name';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
    }

    handlePost(ctx, errors, formdata, session) {
        if (ctx.firstName.length < 2) {
            errors.push(FieldError('firstName', 'length', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }

        if (ctx.lastName.length < 2) {
            errors.push(FieldError('lastName', 'length', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }

        if (!ctx.firstName.match(/^[^<>]+$/)) {
            errors.push(FieldError('firstName', 'invalid', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }

        if (!ctx.firstName.match(/^[^<>]+$/)) {
            errors.push(FieldError('lastName', 'invalid', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }
        return [ctx, errors];
    }

}

module.exports = ApplicantName;
