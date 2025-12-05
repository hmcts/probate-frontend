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
        const firstNameKeyword = ApplicantName.getLengthKeyword(ctx.firstName);
        const lastNameKeyword = ApplicantName.getLengthKeyword(ctx.lastName);

        if (firstNameKeyword) {
            errors.push(FieldError('firstName', firstNameKeyword, this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }
        if (lastNameKeyword) {
            errors.push(FieldError('lastName', lastNameKeyword, this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }
        return [ctx, errors];
    }

    static getLengthKeyword(value) {
        if (!value) {
            return '';
        }
        if (value.length < 2) {
            return 'minLength';
        }
        if (value.length > 100) {
            return 'maxLength';
        }
        return '';
    }
}

module.exports = ApplicantName;
