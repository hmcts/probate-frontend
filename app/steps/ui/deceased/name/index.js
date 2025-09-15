'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FieldError = require('../../../../components/error');

class DeceasedName extends ValidationStep {

    static getUrl() {
        return '/deceased-name';
    }

    handlePost(ctx, errors, formdata, session) {

        if (ctx.firstName && ctx.firstName.length < 2) {
            errors.push(FieldError('firstName', 'minLength', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
            return [ctx, errors];
        } else if (ctx.firstName && ctx.firstName.length > 100) {
            errors.push(FieldError('firstName', 'maxLength', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
            return [ctx, errors];
        }

        if (ctx.lastName && ctx.lastName.length < 2) {
            errors.push(FieldError('lastName', 'minLength', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
            return [ctx, errors];
        } else if (ctx.lastName && ctx.lastName.length > 100) {
            errors.push(FieldError('lastName', 'maxLength', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
            return [ctx, errors];
        }
        return [ctx, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.index;
        return [ctx, formdata];
    }
}

module.exports = DeceasedName;
