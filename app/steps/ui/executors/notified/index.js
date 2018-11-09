'use strict';

const CollectionStep = require('app/core/steps/CollectionStep');
const {get, some, findIndex} = require('lodash');
const path = '/executor-notified/';
const FeatureToggle = require('app/utils/FeatureToggle');

class ExecutorNotified extends CollectionStep {

    constructor(steps, section, templatePath, i18next, schema) {
        super(steps, section, templatePath, i18next, schema);
        this.path = path;
    }

    static getUrl(index = '*') {
        return path + index;
    }

    nextStepOptions(ctx) {
        ctx.nextExecutor = get(ctx, 'index', -1) !== -1;

        if (ctx.isToggleEnabled) {
            if (ctx.nextExecutor !== true) {
                ctx.otherwise = true;
            }

            return {
                options: [
                    {key: 'nextExecutor', value: true, choice: 'roles'},
                    {key: 'otherwise', value: true, choice: 'otherwiseToggleOn'}
                ]
            };
        }

        return {
            options: [
                {key: 'nextExecutor', value: true, choice: 'roles'}
            ]
        };
    }

    handlePost(ctx, errors, formdata, session, hostname, featureToggles) {
        ctx.isToggleEnabled = FeatureToggle.isEnabled(featureToggles, 'screening_questions');

        formdata.executors.list[ctx.index].executorNotified = ctx.executorNotified;
        ctx.index = this.recalcIndex(ctx);
        return [ctx, errors];
    }

    handleGet(ctx, formdata) {
        const currentExecutor = formdata.executors.list[ctx.index];
        ctx.executorNotified = currentExecutor.executorNotified;
        return [ctx];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.otherwise;
        delete ctx.isToggleEnabled;
        delete ctx.executorNotified;
        delete ctx.executorName;
        delete ctx.nextExecutor;
        return [ctx, formdata];
    }

    isSoftStop(formdata, ctx) {
        const execList = get(formdata, 'executors.list', []);
        const softStopForNotNotified = some(execList, exec => exec.executorNotified === this.generateContent(ctx, formdata).optionNo);

        return {
            'stepName': this.constructor.name,
            'isSoftStop': softStopForNotNotified
        };
    }

    recalcIndex(ctx) {
        return findIndex(ctx.list, exec => !exec.isDead && (ctx.otherExecutorsApplying === this.commonContent().no || !exec.isApplying), ctx.index + 1);
    }
}

module.exports = ExecutorNotified;
