'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class DeceasedPartnerName extends ValidationStep {

    constructor(steps, section, templatePath, i18next, schema, language = 'en') {
        super(steps, section, templatePath, i18next, schema, language);
    }

    validate(ctx, formdata, language) {
        const [isValid, errors] = super.validate(ctx, formdata, language);
        if (!isValid) {
            errors.forEach(e => {
                if (e.msg.indexOf('{deceasedName}') !== -1) {
                    e.msg = e.msg.replace('{deceasedName}', `${ctx.firstName} ${ctx.lastName}`);
                }
            });
        }
        return [isValid, errors];
    }

    static getUrl() {
        return '/deceased-partner-name';
    }
}

module.exports = DeceasedPartnerName;
