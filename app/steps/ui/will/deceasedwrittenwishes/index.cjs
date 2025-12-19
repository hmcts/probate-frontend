'use strict';

const ValidationStep = require('app/core/steps/ValidationStep.cjs');
const FormatName = require('../../../../utils/FormatName.cjs');

class DeceasedWrittenWishes extends ValidationStep {

    static getUrl() {
        return '/deceased-written-wishes';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.deceasedName = FormatName.format(req.session.form.deceased);
        return ctx;
    }

    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);
        if (fields.deceasedName && errors) {
            errors[0].msg = errors[0].msg.replace('{deceasedName}', fields.deceasedName.value);
        }
        return fields;
    }
}

module.exports = DeceasedWrittenWishes;
