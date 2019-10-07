'use strict';

const Step = require('app/core/steps/Step');
const utils = require('app/components/step-utils');
const ExecutorsWrapper = require('app/wrappers/Executors');
const caseTypes = require('app/utils/CaseTypes');

class TaskList extends Step {

    static getUrl() {
        return '/task-list';
    }

    previousTaskStatus(previousTasks) {
        const allPreviousTasksComplete = previousTasks.every((task) => {
            return task.status === 'complete';
        });
        return allPreviousTasksComplete ? 'complete' : 'started';
    }

    copiesPreviousTaskStatus(session, ctx) {
        if (ctx.caseType === caseTypes.GOP) {
            if (ctx.hasMultipleApplicants && session.haveAllExecutorsDeclared === 'false') {
                return 'locked';
            }

            return this.previousTaskStatus([ctx.DeceasedTask, ctx.ExecutorsTask, ctx.ReviewAndConfirmTask]);
        }

        return this.previousTaskStatus([ctx.DeceasedTask, ctx.ApplicantsTask, ctx.ReviewAndConfirmTask]);
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        utils.updateTaskStatus(ctx, req, this.steps);

        ctx.alreadyDeclared = this.alreadyDeclared(req.session);

        if (ctx.caseType === caseTypes.GOP) {
            const executorsWrapper = new ExecutorsWrapper(formdata.executors);
            ctx.hasMultipleApplicants = executorsWrapper.hasMultipleApplicants();
            ctx.declarationStatuses = formdata.executors.declarations;

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
        delete ctx.caseType;
        return [ctx, formdata];
    }
}

module.exports = TaskList;
