'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const services = require('app/components/services');
const ExecutorsWrapper = require('app/wrappers/Executors');
const {get, dropRight} = require('lodash');
const logger = require('app/components/logger')('Init');

module.exports = class ExecutorsNumber extends ValidationStep {

    static getUrl() {
        return '/executors-number';
    }

    getContextData(req) {
        let ctx = super.getContextData(req);
        ctx.executorsNumber = ctx.executorsNumber ? parseInt(ctx.executorsNumber) : ctx.executorsNumber;
        ctx = this.createExecutorList(ctx, req.session.form);
        return ctx;
    }

    createExecutorList(ctx, formdata) {
        const executorsWrapper = new ExecutorsWrapper(formdata.executors);
        ctx.list = get(ctx, 'list', []);
        ctx.list[0] = {
            firstName: get(formdata, 'applicant.firstName'),
            lastName: get(formdata, 'applicant.lastName'),
            isApplying: true,
            isApplicant: true
        };

        if (ctx.list.length > ctx.executorsNumber) {
            return {
                executorsRemoved: executorsWrapper.executorsInvited(),
                list: dropRight(ctx.list, ctx.list.length -1),
                executorsNumber: ctx.executorsNumber,
                invitesSent: ctx.invitesSent
            };
        }
        return ctx;
    }

    * handlePost(ctx) {
        if (ctx.executorsRemoved && ctx.invitesSent === 'true') {
            yield ctx.executorsRemoved
                .map(exec => {
                    return services.removeExecutor(exec.inviteId)
                        .then(result => {
                            if (result.name === 'Error') {
                                logger.error(`Error while deleting executor from invitedata table: ${result.message}`);

                            }
                        });
                });
            delete ctx.executorsRemoved;
            delete ctx.invitesSent;
        }
        return [ctx];
    }

    isComplete(ctx) {
        return [ctx.executorsNumber >= 0, 'inProgress'];
    }

    nextStepOptions() {
        const nextStepOptions = {
            options: [
                {key: 'executorsNumber', value: 1, choice: 'deceasedName'}
            ]
        };
        return nextStepOptions;
    }
};
