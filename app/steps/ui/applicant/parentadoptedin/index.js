'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FormatName = require('../../../../utils/FormatName');

class ParentAdoptedIn extends ValidationStep {

    static getUrl() {
        return '/mainapplicantsparent-adopted-in';
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

    nextStepOptions() {
        return {
            options: [
                {key: 'parentAdoptedIn', value: 'optionYes', choice: 'parentAdoptedIn'},
            ]
        };
    }
}

module.exports = ParentAdoptedIn;
