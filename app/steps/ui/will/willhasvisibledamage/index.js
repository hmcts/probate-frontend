'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const FieldError = require('app/components/error');
const {isEmpty} = require('lodash');

class WillHasVisibleDamage extends ValidationStep {

    static getUrl() {
        return '/will-has-damage';
    }

    nextStepOptions() {
        return {
            options: [
                {
                    key: 'willHasVisibleDamage',
                    value: 'optionYes',
                    choice: 'willDoesHaveVisibleDamage'
                },
            ]
        };
    }

    handleGet(ctx) {
        if (ctx.willDamage) {
            if (ctx.willDamage.damageTypesList) {
                ctx.options = {};
                for (let i = 0; i < ctx.willDamage.damageTypesList.length; i++) {
                    ctx.options[ctx.willDamage.damageTypesList[i]] = true;
                }
            }
            if (ctx.willDamage.damageTypesList && ctx.willDamage.damageTypesList.includes('otherVisibleDamage')) {
                ctx.otherDamageDescription = ctx.willDamage.otherDamageDescription;
            }
        }
        return [ctx];
    }

    handlePost(ctx, errors, formdata, session) {
        if (ctx.willHasVisibleDamage === 'optionNo') {
            ctx = this.resetValues(ctx);
            return [ctx, errors];
        }

        if (ctx.willHasVisibleDamage === 'optionYes' && !ctx.willDamageTypes) {
            errors.push(FieldError('willDamageTypes', 'required', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }
        if (ctx.willHasVisibleDamage === 'optionYes' && ctx.willDamageTypes && ctx.willDamageTypes.includes('otherVisibleDamage') && !ctx.otherDamageDescription) {
            errors.push(FieldError('otherDamageDescription', 'required', this.resourcePath, this.generateContent({}, {}, session.language), session.language));
        }

        if (!isEmpty(errors)) {
            return [ctx, errors];
        }

        const willDamage = {};
        if (ctx.willHasVisibleDamage === 'optionYes') {
            willDamage.damageTypesList = ctx.willDamageTypes;
        } else {
            willDamage.damageTypesList = [];
            ctx = this.resetValues(ctx);
        }
        if (ctx.willDamageTypes && ctx.willDamageTypes.includes('otherVisibleDamage')) {
            willDamage.otherDamageDescription = ctx.otherDamageDescription;
        }
        ctx.willDamage = willDamage;

        return [ctx, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.options;
        delete ctx.willDamageTypes;
        delete ctx.otherDamageDescription;
        return [ctx, formdata];
    }

    resetValues(ctx) {
        if (ctx.willDamageReasonKnown) {
            ctx.willDamageReasonKnown = 'optionNo';
        }

        if (ctx.willDamageReasonDescription) {
            ctx.willDamageReasonDescription = '';
        }

        if (ctx.willDamageCulpritKnown) {
            ctx.willDamageCulpritKnown = 'optionNo';
        }

        if (ctx.willDamageCulpritName) {
            ctx.willDamageCulpritName = {};
        }

        if (ctx.willDamageDateKnown) {
            ctx.willDamageDateKnown = 'optionNo';
        }

        if (ctx.willDamageDate) {
            ctx.willDamageDate = '';
        }

        if (ctx.willDamage) {
            delete ctx.willDamage.damageTypesList;
            delete ctx.willDamage.otherDamageDescription;
        }

        return ctx;
    }
}

module.exports = WillHasVisibleDamage;
