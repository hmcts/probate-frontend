'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');
const services = require('app/components/services');
const ExecutorsWrapper = require('app/wrappers/Executors');
const json = require('app/resources/en/translation/executors/applying.json');
const logger = require('app/components/logger')('Init');

module.exports = class ExecutorsApplying extends ValidationStep {

    static getUrl() {
        return '/other-executors-applying';
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const executorsWrapper = new ExecutorsWrapper(ctx.executors);
        ctx.executorsInvitedList = executorsWrapper.executorsInvited();
        return ctx;
    }

    * handlePost(ctx) {
        if (ctx.invitesSent && json.optionNo) {
            yield ctx.executorsInvitedList
                .map(exec => {
                    return services.removeExecutor(exec.inviteId)
                        .then(result => {
                            if (result.name === 'Error') {
                                logger.error(`Error while deleting executor from invitedata table: ${result.message}`);
                            }
                        });
                });
            delete ctx.executorsInvitedList;
            delete ctx.invitesSent;
        }
        return [ctx];
    }

    nextStepOptions() {
        const nextStepOptions = {
            options: [
                {key: 'otherExecutorsApplying', value: json.optionYes, choice: 'otherExecutorsApplying'}
            ]
        };
        return nextStepOptions;
    }
};
