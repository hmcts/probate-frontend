'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');

class GrandchildAdoptedOut extends ValidationStep {

    static getUrl() {
        return '/mainapplicantsparent-adopted-you-out';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        ctx.deceasedName = FormatName.format(formdata.deceased);
        return ctx;
    }

    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);
        if (fields.deceasedName && errors) {
            errors[0].msg = errors[0].msg.replace('{deceasedName}', fields.deceasedName.value);
        }
        return fields;
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('adoptedOut');
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'grandchildAdoptedOut', value: 'optionNo', choice: 'grandchildNotAdoptedOut'},
            ]
        };
    }
}

module.exports = GrandchildAdoptedOut;
