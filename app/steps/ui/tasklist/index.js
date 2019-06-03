'use strict';

const Step = require('app/core/steps/Step');
const utils = require('app/components/step-utils');
const ExecutorsWrapper = require('app/wrappers/Executors');
const setJourney = require('app/middleware/setJourney');

class TaskList extends Step {

    static getUrl() {
        return '/tasklist';
    }

    previousTaskStatus(previousTasks) {
        console.log(previousTasks);
        const allPreviousTasksComplete = previousTasks.every((task) => {
            console.log(task, task.status);
            return task.status === 'complete';
        });
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
        ctx.journeyType = setJourney.getJourneyName(req.session);

        if (ctx.journeyType === 'gop') {
            ctx.previousTaskStatus = {
                DeceasedTask: ctx.DeceasedTask.status,
                ExecutorsTask: ctx.DeceasedTask.status,
                ReviewAndConfirmTask: this.previousTaskStatus([ctx.DeceasedTask, ctx.ExecutorsTask]),
                CopiesTask: this.copiesPreviousTaskStatus(req.session, ctx),
                PaymentTask: this.previousTaskStatus([ctx.DeceasedTask, ctx.ExecutorsTask, ctx.ReviewAndConfirmTask, ctx.CopiesTask]),
                DocumentsTask: this.previousTaskStatus([ctx.DeceasedTask, ctx.ExecutorsTask, ctx.ReviewAndConfirmTask, ctx.CopiesTask, ctx.PaymentTask])
            };
        } else {
            ctx.previousTaskStatus = {
                DeceasedTask: ctx.DeceasedTask.status,
                ApplicantsTask: ctx.DeceasedTask.status,
                ReviewAndConfirmTask: this.previousTaskStatus([ctx.DeceasedTask, ctx.ApplicantsTask]),
                CopiesTask: this.copiesPreviousTaskStatus(req.session, ctx),
                PaymentTask: this.previousTaskStatus([ctx.DeceasedTask, ctx.ApplicantsTask, ctx.ReviewAndConfirmTask, ctx.CopiesTask]),
            };
        }

        return ctx;
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.hasMultipleApplicants;
        delete ctx.alreadyDeclared;
        delete ctx.previousTaskStatus;
        delete ctx.journeyType;
        return [ctx, formdata];
    }
}

module.exports = TaskList;
