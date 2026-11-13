'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const validator = require("validator");
const config = require("config");
const FieldError = require("../../../../components/error");

class DeceasedName extends ValidationStep {

    static getUrl() {
        return '/deceased-name';
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.index;
        return [ctx, formdata];
    }

    handlePost(ctx, errors, formdata, session) {
        ['firstName', 'lastName'].forEach((field) => {
            if (ctx[field] && validator.isURL(ctx[field], config.validUrl.options)) {
                errors.push(FieldError(
                    field,
                    'invalid',
                    this.resourcePath,
                    this.generateContent({}, {}, session.language),
                    session.language
                ));
            }
        });

        return [ctx, errors];
    }
}

module.exports = DeceasedName;
