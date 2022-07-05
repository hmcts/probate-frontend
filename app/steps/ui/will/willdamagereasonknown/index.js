'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FieldError = require('app/components/error');
const {isEmpty} = require('lodash');

class WillDamageReasonKnown extends ValidationStep {

    static getUrl() {
        return '/will-damage-reason';
    }

    handleGet(ctx) {
        if (ctx.willDamageReasonKnown === 'optionNo') {
            ctx.willDamageReasonDescription = null;
        }

        return [ctx];
    }

    handlePost(ctx, errors, formdata, session) {
        if (ctx.willDamageReasonKnown === 'optionYes' && !ctx.willDamageReasonDescription) {
            errors.push(FieldError('willDamageReasonDescription', 'required', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }

        if (!isEmpty(errors)) {
            return [ctx, errors];
        }

        if (ctx.willDamageReasonKnown === 'optionNo') {
            ctx.willDamageReasonDescription = '';
        }
        return super.handlePost(ctx, errors);
    }

}

module.exports = WillDamageReasonKnown;
