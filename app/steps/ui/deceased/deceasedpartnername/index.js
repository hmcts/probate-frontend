'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class DeceasedPartnerName extends ValidationStep {

    static getUrl() {
        return '/deceased-partner-name';
    }

    validate(ctx, formdata, language) {
        const [isValid, errors] = super.validate(ctx, formdata, language);
        if (!isValid) {
            errors.forEach(e => {
                if (e.msg.includes('{deceasedName}')) {
                    e.msg = e.msg.replace('{deceasedName}', `${ctx.firstName} ${ctx.lastName}`);
                }
            });
        }
        return [isValid, errors];
    }

}

module.exports = DeceasedPartnerName;
