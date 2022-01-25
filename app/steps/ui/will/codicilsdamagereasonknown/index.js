'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FieldError = require('app/components/error');
const {isEmpty} = require('lodash');

class CodicilsDamageReasonKnown extends ValidationStep {

    static getUrl() {
        return '/codicils-damage-reason';
    }

    handleGet(ctx) {
        if (ctx.codicilsDamageReasonKnown === 'optionNo') {
            ctx.codicilsDamageReasonDescription = null;
        }

        return [ctx];
    }

    handlePost(ctx, errors, formdata, session) {
        if (ctx.codicilsDamageReasonKnown === 'optionYes' && !ctx.codicilsDamageReasonDescription) {
            errors.push(FieldError('codicilsDamageReasonDescription', 'required', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }

        if (!isEmpty(errors)) {
            return [ctx, errors];
        }

        if (ctx.codicilsDamageReasonKnown === 'optionNo') {
            ctx.codicilsDamageReasonDescription = '';
        }
        return super.handlePost(ctx, errors);
    }

}

module.exports = CodicilsDamageReasonKnown;
