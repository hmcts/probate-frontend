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

    paymentPreviousTaskStatus(session, ctx) {
        if (ctx.caseType === caseTypes.GOP) {
            if (ctx.hasMultipleApplicants && session.haveAllExecutorsDeclared === 'false') {
                return 'locked';
            }

            return this.previousTaskStatus([ctx.DeceasedTask, ctx.ExecutorsTask, ctx.ReviewAndConfirmTask]);
        }

        return this.previousTaskStatus([ctx.DeceasedTask, ctx.ApplicantsTask, ctx.ReviewAndConfirmTask]);
    }

    getContextData(req, res) {
        const ctx = super.getContextData(req);
        const formdata = req.session.form;
        utils.updateTaskStatus(ctx, req, res, this.steps);

        ctx.alreadyDeclared = this.alreadyDeclared(req.session);
        ctx.alreadyDeclaredType = typeof ctx.alreadyDeclared;

        if (ctx.caseType === caseTypes.GOP) {
            const executorsWrapper = new ExecutorsWrapper(formdata.executors);
            ctx.hasMultipleApplicants = executorsWrapper.hasMultipleApplicants();
            ctx.declarationStatuses = formdata.executorsDeclarations || [];

            ctx.previousTaskStatus = {
                DeceasedTask: ctx.DeceasedTask.status,
                ExecutorsTask: ctx.DeceasedTask.status,
                ReviewAndConfirmTask: this.previousTaskStatus([ctx.DeceasedTask, ctx.ExecutorsTask]),
                PaymentTask: this.paymentPreviousTaskStatus(req.session, ctx),
                DocumentsTask: this.previousTaskStatus([ctx.DeceasedTask, ctx.ExecutorsTask, ctx.ReviewAndConfirmTask, ctx.PaymentTask])
            };
        } else {
            ctx.previousTaskStatus = {
                DeceasedTask: ctx.DeceasedTask.status,
                ApplicantsTask: ctx.DeceasedTask.status,
                ReviewAndConfirmTask: this.previousTaskStatus([ctx.DeceasedTask, ctx.ApplicantsTask]),
                PaymentTask: this.paymentPreviousTaskStatus(req.session, ctx)
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
        delete ctx.declarationStatuses;
        return [ctx, formdata];
    }
}

module.exports = TaskList;
