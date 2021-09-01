'use strict';

const ValidationStep = require('app/core/steps/ValidationStep');

class ExecutorsAlias extends ValidationStep {

    static getUrl() {
        return '/executors-alias*';
    }

    pruneFormData(ctx) {
        if (ctx.list && ctx.alias === 'optionNo') {
            const list = ctx.list.map(executor => {
                if (executor.hasOtherName) {
                    executor.hasOtherName = false;
                    delete executor.currentName;
                    delete executor.currentNameReason;
                    delete executor.otherReason;
                }
                return executor;
            });
            return Object.assign(ctx, {list});
        }
        return ctx;
    }

    handlePost(ctx, errors) {
        ctx = this.pruneFormData(ctx);
        return [ctx, errors];
    }

    nextStepOptions() {
        return {
            options: [
                {key: 'alias', value: 'optionYes', choice: 'withAlias'}
            ]
        };
    }
}

module.exports = ExecutorsAlias;
