'use strict';

const CollectionStep = require('app/core/steps/CollectionStep');
const {get, some, findIndex} = require('lodash');
const path = '/executor-notified/';

class ExecutorNotified extends CollectionStep {

    constructor(steps, section, templatePath, i18next, schema, language) {
        super(steps, section, templatePath, i18next, schema, language);
        this.path = path;
    }

    static getUrl(index = '*') {
        return path + index;
    }

    nextStepOptions(ctx) {
        ctx.nextExecutor = get(ctx, 'index', -1) !== -1;

        return {
            options: [
                {key: 'nextExecutor', value: true, choice: 'roles'}
            ]
        };
    }

    handlePost(ctx, errors, formdata, session) {
        formdata.executors.list[ctx.index].executorNotified = ctx.executorNotified;
        ctx.index = this.recalcIndex(ctx, 0, session.language);
        return [ctx, errors];
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.executorName = ctx.list?.[ctx.index] ? ctx.list[ctx.index].fullName : '';
        return ctx;
    }

    handleGet(ctx, formdata) {
        const currentExecutor = formdata.executors.list[ctx.index];
        ctx.executorNotified = currentExecutor.executorNotified;
        return [ctx];
    }

    generateFields(language, ctx, errors) {
        const fields = super.generateFields(language, ctx, errors);
        if (fields.executorName && errors) {
            errors[0].msg = errors[0].msg.replace('{executorName}', fields.executorName.value);
        }
        return fields;
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.otherwise;
        delete ctx.executorNotified;
        delete ctx.executorName;
        delete ctx.nextExecutor;
        return [ctx, formdata];
    }

    isSoftStop(formdata) {
        const execList = get(formdata, 'executors.list', []);
        const softStopForNotNotified = some(execList, exec => exec.executorNotified === 'optionNo');

        return {
            stepName: this.constructor.name,
            isSoftStop: softStopForNotNotified
        };
    }

    recalcIndex(ctx, index, language) {
        return findIndex(ctx.list, exec => !exec.isDead && (ctx.otherExecutorsApplying === this.commonContent(language).no || !exec.isApplying), ctx.index + 1);
    }
}

module.exports = ExecutorNotified;
