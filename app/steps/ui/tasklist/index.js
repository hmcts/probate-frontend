'use strict';

const Step = require('app/core/steps/Step');
const utils = require('app/components/step-utils');
const ExecutorsWrapper = require('app/wrappers/Executors');

module.exports = class TaskList extends Step {

    static getUrl() {
        return '/tasklist';
    }

    previousTaskStatus(previousTasks) {
        const allPreviousTasksComplete = previousTasks.every(task => task.status === 'complete');
        return allPreviousTasksComplete ? 'complete' : 'started';
    }

    copiesPreviousTaskStatus(session, ctx) {
        if (ctx.hasMultipleApplicants && session.haveAllExecutorsDeclared === 'false') {
            return 'locked';
        }

        return this.previousTaskStatus([ctx.DeceasedTask, ctx.ExecutorsTask, ctx.ReviewAndConfirmTask]);
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        const executorsWrapper = new ExecutorsWrapper(formdata.executors);
        utils.updateTaskStatus(ctx, req, this.steps);

        ctx.hasMultipleApplicants = executorsWrapper.hasMultipleApplicants();
        ctx.alreadyDeclared = this.alreadyDeclared(req.session);

        ctx.previousTaskStatus = {
            DeceasedTask: ctx.DeceasedTask.status,
            ExecutorsTask: ctx.DeceasedTask.status,
            ReviewAndConfirmTask: this.previousTaskStatus([ctx.DeceasedTask, ctx.ExecutorsTask]),
            CopiesTask: this.copiesPreviousTaskStatus(req.session, ctx),
            PaymentTask: this.previousTaskStatus([ctx.DeceasedTask, ctx.ExecutorsTask, ctx.ReviewAndConfirmTask, ctx.CopiesTask]),
            DocumentsTask: this.previousTaskStatus([ctx.DeceasedTask, ctx.ExecutorsTask, ctx.ReviewAndConfirmTask, ctx.CopiesTask, ctx.PaymentTask])
        };

        return ctx;
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.hasMultipleApplicants;
        delete ctx.alreadyDeclared;
        delete ctx.previousTaskStatus;
        return [ctx, formdata];
    }
};
