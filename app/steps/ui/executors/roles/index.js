'use strict';

const CollectionStep = require('app/core/steps/CollectionStep');
const content = require('app/resources/en/translation/executors/roles');
const json = require('app/resources/en/translation/executors/roles');
const {get, isEmpty, every, findKey, findIndex, forEach} = require('lodash');
const path = '/executor-roles/';

class ExecutorRoles extends CollectionStep {

    constructor(steps, section, templatePath, i18next, schema) {
        super(steps, section, templatePath, i18next, schema);
        this.path = path;
    }

    static getUrl(index = '*') {
        return path + index;
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        forEach(ctx.list, exec => {
            if (exec.notApplyingKey) {
                exec.notApplyingReason = json[exec.notApplyingKey];
            }
        });

        return ctx;
    }

    handleGet(ctx) {
        if (ctx.list[ctx.index]) {
            ctx.isApplying = false;
            ctx.notApplyingReason = json[ctx.list[ctx.index].notApplyingKey];
        }
        return [ctx];
    }

    handlePost(ctx, errors) {
        if (ctx.list[ctx.index]) {
            ctx.list[ctx.index] = this.pruneExecutorData(ctx.list[ctx.index]);
            ctx.list[ctx.index].isApplying = false;
            ctx.list[ctx.index].notApplyingReason = ctx.notApplyingReason;
            ctx.list[ctx.index].notApplyingKey = findKey(content, o => o === ctx.notApplyingReason);
        }
        if (ctx.notApplyingReason !== content.optionPowerReserved) {
            ctx.index = this.recalcIndex(ctx, ctx.index);
        }
        return [ctx, errors];
    }

    pruneExecutorData(data) {
        delete data.address;
        delete data.currentName;
        delete data.currentNameReason;
        delete data.email;
        delete data.hasOtherName;
        delete data.mobile;
        delete data.postcode;
        return data;
    }

    isComplete(ctx) {
        return [every(ctx.list, exec => {
            return exec.isApplying ||
                (
                    !isEmpty(exec.notApplyingKey) &&
                    (
                        (exec.notApplyingKey === 'optionPowerReserved' && !isEmpty(exec.executorNotified)) ||
                        (exec.notApplyingKey !== 'optionPowerReserved')
                    )
                );
        }), 'inProgress'];
    }

    nextStepOptions(ctx) {
        ctx.continue = get(ctx, 'index', -1) !== -1;

        return {
            options: [
                {key: 'notApplyingReason', value: content.optionPowerReserved, choice: 'powerReserved'},
                {key: 'continue', value: true, choice: 'continue'}
            ]
        };
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.otherwise;
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
