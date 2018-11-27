'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const json = require('app/resources/en/translation/will/codicils');
const FeatureToggle = require('app/utils/FeatureToggle');

class WillCodicils extends ValidationStep {

    static getUrl() {
        return '/will-codicils';
    }

    nextStepUrl(req, ctx) {
        return this.next(req, ctx).constructor.getUrl('codicils');
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.isToggleEnabled = FeatureToggle.isEnabled(req.session.featureToggles, 'screening_questions');
        return ctx;
    }

    nextStepOptions(ctx) {
        if (ctx.isToggleEnabled) {
            return {
                options: [
                    {key: 'codicils', value: json.optionNo, choice: 'noCodicilsToggleOn'}
                ]
            };
        }

        return {
            options: [
                {key: 'codicils', value: json.optionNo, choice: 'noCodicils'}
            ]
        };
    }

    action(ctx, formdata) {
        if (ctx.codicils === this.generateContent(ctx, formdata).optionNo) {
            delete ctx.codicilsNumber;
        }
        super.action(ctx, formdata);
        delete ctx.isToggleEnabled;
        return [ctx, formdata];
    }
}

module.exports = WillCodicils;
