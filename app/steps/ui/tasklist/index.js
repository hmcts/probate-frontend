'use strict';

const Step = require('app/core/steps/Step');
const utils = require('app/components/step-utils');
const ExecutorsWrapper = require('app/wrappers/Executors');
const caseTypes = require('app/utils/CaseTypes');
const DateValidation = require('app/utils/DateValidation');

class TaskList extends Step {

    static getUrl() {
        return '/task-list';
    }

    previousTaskStatus(previousTasks) {
        const allPreviousTasksComplete = previousTasks.every((task) => {
            return task && task.status === 'complete';
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
        ctx.displayInactiveAlertBanner = DateValidation.isInactivePeriod(formdata.ccdCase?.lastModifiedDate);
        const daysToDelete = DateValidation.daysToDelete(formdata.ccdCase?.lastModifiedDate);
        if (req.session.language === 'cy') {
            ctx.daysToDeleteText = daysToDelete + ' diwrnod';
        } else {
            ctx.daysToDeleteText = daysToDelete > 1 ? daysToDelete + ' days' : daysToDelete + ' day';
        }

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

    handlePost(ctx, errors) {
        if (ctx.isKeepDraft === 'true') {
            ctx.displaySuccessBanner = true;
        }
        return [ctx, errors];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.hasMultipleApplicants;
        delete ctx.alreadyDeclared;
        delete ctx.previousTaskStatus;
        delete ctx.caseType;
        delete ctx.declarationStatuses;
        delete ctx.displayInactiveAlertBanner;
        delete ctx.daysToDeleteText;
        delete ctx.isKeepDraft;
        return [ctx, formdata];
    }

    shouldHaveBackLink() {
        return false;
    }
}

module.exports = TaskList;
