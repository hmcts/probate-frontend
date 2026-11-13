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
        if (ctx.firstName && validator.isURL(ctx.firstName, config.validUrl.options)) {
            errors.push(FieldError('firstName', 'invalid', this.resourcePath, this.generateContent({}, {}, session.language), session.language));

        }
        if (ctx.lastName && validator.isURL(ctx.lastName, config.validUrl.options)) {
            errors.push(FieldError('lastName', 'invalid', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }
        return [ctx, errors];
    }
}

module.exports = DeceasedName;
