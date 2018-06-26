'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const services = require('app/components/services');
const {includes, some, tail} = require('lodash');
const ExecutorsWrapper = require('app/wrappers/Executors');
const FormatName = require('app/utils/FormatName');
const logger = require('app/components/logger')('Init');

module.exports = class ExecutorsDealingWithEstate extends ValidationStep {

    static getUrl() {
        return '/executors-dealing-with-estate';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        if (ctx.list) {
            ctx.options = (new ExecutorsWrapper(ctx)).aliveExecutors()
                .map(executor => {
                    if (executor.isApplicant) {
                        return {option: FormatName.format(executor), checked: true, disabled: true};
                    }
                    return {option: executor.fullName, checked: executor.isApplying === true};
                });
        }
        return ctx;
    }

    pruneFormData(data) {
        if (data.isApplying) {
            delete data.isDead;
            delete data.diedBefore;
            delete data.notApplyingReason;
            delete data.notApplyingKey;
        }
        return data;
    }

    * handlePost(ctx, errors) {
        for (let i = 1; i < ctx.executorsNumber; i++) {
            ctx.list[i].isApplying = includes(ctx.executorsApplying, ctx.list[i].fullName);
            ctx.list[i] = this.pruneFormData(ctx.list[i]);

            if (!ctx.list[i].isApplying && ctx.list[i].inviteId) {
                yield services.removeExecutor(ctx.list[i].inviteId).then(result => {
                    if (result.name === 'Error') {
                        logger.error(`Error while deleting executor from invitedata table: ${result.message}`);
                    }
                });
                delete ctx.list[i].inviteId;
            }
        }
        return [ctx, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.options;
        delete ctx.executorsApplying;
        return [ctx, formdata];
    }

    isComplete(ctx) {
        return [some(tail(ctx.list), exec => exec.isApplying === true), 'inProgress'];
    }
};
