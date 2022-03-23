'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const JourneyMap = require('app/core/JourneyMap');
const featureToggle = require('app/utils/FeatureToggle');

class WillCodicils extends ValidationStep {

    static getUrl() {
        return '/will-codicils';
    }

    next(req, ctx) {
        const journeyMap = new JourneyMap(req.session.journey);
        if (featureToggle.isEnabled(req.session.featureToggles, 'ft_will_condition')) {
            return journeyMap.nextStep(this, ctx);
        }

        if (ctx.codicils === 'optionNo') {
            return journeyMap.getNextStepByName('TaskList');
        }
        return journeyMap.getNextStepByName('CodicilsNumber');
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('codicils');
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'codicils', value: 'optionNo', choice: 'noCodicils'}
            ]
        };
    }

    action(ctx, formdata) {
        if (ctx.codicils === 'optionNo') {
            delete ctx.codicilsNumber;
            this.resetValues(ctx);
        }
        super.action(ctx, formdata);
        return [ctx, formdata];
    }

    resetValues(ctx) {
        if (ctx.codicilsHasVisibleDamage) {
            ctx.codicilsHasVisibleDamage = 'optionNo';
        }

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

module.exports = WillCodicils;
