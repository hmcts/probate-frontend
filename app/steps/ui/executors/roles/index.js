'use strict';

const CollectionStep = require('app/core/steps/CollectionStep');
const json = require('app/resources/en/translation/executors/roles');
const {get, isEmpty, every, findKey, findIndex} = require('lodash');
const path = '/executor-roles/';
const FeatureToggle = require('app/utils/FeatureToggle');

class ExecutorRoles extends CollectionStep {

    constructor(steps, section, templatePath, i18next, schema) {
        super(steps, section, templatePath, i18next, schema);
        this.path = path;
    }

    static getUrl(index = '*') {
        return path + index;
    }

    handleGet(ctx) {
        if (ctx.list[ctx.index]) {
            ctx.isApplying = false;
            ctx.notApplyingReason = ctx.list[ctx.index].notApplyingReason;
        }
        return [ctx];
    }

    handlePost(ctx, errors, formdata, session, hostname, featureToggles) {
        ctx.isToggleEnabled = FeatureToggle.isEnabled(featureToggles, 'screening_questions');

        if (ctx.list[ctx.index]) {
            ctx.list[ctx.index].isApplying = false;
            ctx.list[ctx.index].notApplyingReason = ctx.notApplyingReason;
            ctx.list[ctx.index].notApplyingKey = findKey(json, o => o === ctx.notApplyingReason);
        }
        if (ctx.notApplyingReason !== json.optionPowerReserved) {
            ctx.index = this.recalcIndex(ctx, ctx.index);
        }
        return [ctx, errors];
    }

    isComplete(ctx) {
        return [every(ctx.list, exec => {
            return exec.isApplying ||
                (
                    !isEmpty(exec.notApplyingReason) &&
                    (
                        (exec.notApplyingReason === json.optionPowerReserved && !isEmpty(exec.executorNotified)) ||
                        (exec.notApplyingReason !== json.optionPowerReserved)
                    )
                );
        }), 'inProgress'];
    }

    nextStepOptions(ctx) {
        ctx.continue = get(ctx, 'index', -1) !== -1;

        if (ctx.isToggleEnabled) {
            if (ctx.notApplyingReason !== json.optionPowerReserved && ctx.continue !== true) {
                ctx.otherwise = true;
            }

            return {
                options: [
                    {key: 'notApplyingReason', value: json.optionPowerReserved, choice: 'powerReserved'},
                    {key: 'continue', value: true, choice: 'continue'},
                    {key: 'otherwise', value: true, choice: 'otherwiseToggleOn'}
                ]
            };
        }

        return {
            options: [
                {key: 'notApplyingReason', value: json.optionPowerReserved, choice: 'powerReserved'},
                {key: 'continue', value: true, choice: 'continue'}
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.otherwise;
        delete ctx.isToggleEnabled;
        delete ctx.executorName;
        delete ctx.isApplying;
        delete ctx.notApplyingReason;
        delete ctx.continue;
        return [ctx, formdata];
    }

    recalcIndex(ctx, index) {
        return findIndex(ctx.list, exec => !exec.isDead && (ctx.otherExecutorsApplying === this.commonContent().no || !exec.isApplying), index + 1);
    }
}

module.exports = ExecutorRoles;
