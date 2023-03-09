'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FieldError = require('app/components/error');
const {isEmpty} = require('lodash');

class CodicilsHasVisibleDamage extends ValidationStep {

    static getUrl() {
        return '/codicils-have-damage';
    }

    nextStepOptions() {
        return {
            options: [
                {
                    key: 'codicilsHasVisibleDamage',
                    value: 'optionYes',
                    choice: 'codicilsDoesHaveVisibleDamage'
                },
            ]
        };
    }

    handleGet(ctx) {
        if (ctx.codicilsDamage) {
            if (ctx.codicilsDamage.damageTypesList) {
                ctx.options = {};
                for (const damageType of ctx.codicilsDamage.damageTypesList) {
                    ctx.options[damageType] = true;
                }
            }
            if (ctx.codicilsDamage.damageTypesList && ctx.codicilsDamage.damageTypesList.includes('otherVisibleDamage')) {
                ctx.otherDamageDescription = ctx.codicilsDamage.otherDamageDescription;
            }
        }
        return [ctx];
    }

    handlePost(ctx, errors, formdata, session) {
        if (ctx.codicilsHasVisibleDamage === 'optionNo') {
            ctx = this.resetValues(ctx);
            return [ctx, errors];
        }

        if (ctx.codicilsHasVisibleDamage === 'optionYes' && !ctx.codicilsDamageTypes) {
            errors.push(FieldError('codicilsDamageTypes', 'required', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }
        if (ctx.codicilsHasVisibleDamage === 'optionYes' && ctx.codicilsDamageTypes && ctx.codicilsDamageTypes.includes('otherVisibleDamage') && !ctx.otherDamageDescription) {
            errors.push(FieldError('otherDamageDescription', 'required', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }

        if (!isEmpty(errors)) {
            return [ctx, errors];
        }

        const codicilsDamage = {};
        if (ctx.codicilsHasVisibleDamage === 'optionYes') {
            codicilsDamage.damageTypesList = ctx.codicilsDamageTypes;
        } else {
            codicilsDamage.damageTypesList = [];
            ctx = this.resetValues(ctx);
        }
        if (ctx.codicilsDamageTypes && ctx.codicilsDamageTypes.includes('otherVisibleDamage')) {
            codicilsDamage.otherDamageDescription = ctx.otherDamageDescription;
        }
        ctx.codicilsDamage = codicilsDamage;

        return [ctx, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.options;
        delete ctx.codicilsDamageTypes;
        delete ctx.otherDamageDescription;
        return [ctx, formdata];
    }

    resetValues(ctx) {
        if (ctx.codicilsDamageReasonKnown) {
            ctx.codicilsDamageReasonKnown = 'optionNo';
        }

        if (ctx.codicilsDamageReasonDescription) {
            ctx.codicilsDamageReasonDescription = '';
        }

        if (ctx.codicilsDamageCulpritKnown) {
            ctx.codicilsDamageCulpritKnown = 'optionNo';
        }

        if (ctx.codicilsDamageCulpritName) {
            ctx.codicilsDamageCulpritName = {};
        }

        if (ctx.codicilsDamageDateKnown) {
            ctx.codicilsDamageDateKnown = 'optionNo';
        }

        if (ctx.codicilsDamageDate) {
            ctx.codicilsDamageDate = '';
        }

        if (ctx.deceasedWrittenWishes) {
            ctx.deceasedWrittenWishes = 'optionNo';
        }

        if (ctx.codicilsDamage) {
            delete ctx.codicilsDamage.damageTypesList;
            delete ctx.codicilsDamage.otherDamageDescription;
        }

        return ctx;
    }
}

module.exports = CodicilsHasVisibleDamage;
