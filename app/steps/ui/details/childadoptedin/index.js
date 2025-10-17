'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');

class ChildAdoptedIn extends ValidationStep {

    static getUrl() {
        return '/child-adopted-in';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        ctx.relationshipToDeceased = formdata.applicant && formdata.applicant.relationshipToDeceased;
        return ctx;
    }

    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);
        if (fields.deceasedName && errors) {
            errors[0].msg = errors[0].msg.replace('{deceasedName}', fields.deceasedName.value);
        }
        return fields;
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'childAdoptedIn', value: 'optionYes', choice: 'childAdoptedIn'},
                {key: 'childAdoptedIn', value: 'optionNo', choice: 'childNotAdoptedIn'},
            ]
        };
    }

    handlePost(ctx, errors, formdata) {
        const applicant = formdata.applicant;
        ctx.relationshipToDeceased = applicant && applicant.relationshipToDeceased;
        return [ctx, errors];
    }
}

module.exports = ChildAdoptedIn;
