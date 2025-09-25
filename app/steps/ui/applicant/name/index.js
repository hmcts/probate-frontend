'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');
const FieldError = require('../../../../components/error');

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

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.deceasedName;
        return [ctx, formdata];
    }

    handlePost(ctx, errors, formdata, session) {
        if (ctx.firstName && ctx.firstName.length < 2) {
            errors.push(FieldError('firstName', 'minLength', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        } else if (ctx.firstName && ctx.firstName.length > 100) {
            errors.push(FieldError('firstName', 'maxLength', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }

        if (ctx.lastName && ctx.lastName.length < 2) {
            errors.push(FieldError('lastName', 'minLength', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        } else if (ctx.lastName && ctx.lastName.length > 100) {
            errors.push(FieldError('lastName', 'maxLength', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }
        return [ctx, errors];
    }
}

module.exports = ApplicantName;
