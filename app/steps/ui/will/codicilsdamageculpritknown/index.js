'use.strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FieldError = require('app/components/error');
const {isEmpty} = require('lodash');

class CodicilsDamageCulpritKnown extends ValidationStep {

    static getUrl() {
        return '/codicils-damage-who';
    }

    handlePost(ctx, errors, formdata, session) {
        if (ctx.codicilsDamageCulpritKnown === 'optionYes') {
            if (!ctx.firstName) {
                errors.push(FieldError('firstName', 'required', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
            }
            if (!ctx.lastName) {
                errors.push(FieldError('lastName', 'required', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
            }
        }

        if (!isEmpty(errors)) {
            return [ctx, errors];
        }

        if (ctx.codicilsDamageCulpritKnown === 'optionYes' && ctx.firstName && ctx.lastName) {
            ctx.codicilsDamageCulpritName = {'firstName': ctx.firstName, 'lastName': ctx.lastName};
        }

        return [ctx, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        if (ctx.codicilsDamageCulpritKnown === 'optionNo') {
            ctx.codicilsDamageCulpritName = {};
        }
        delete ctx.firstName;
        delete ctx.lastName;
        return [ctx, formdata];
    }

}

module.exports = CodicilsDamageCulpritKnown;
