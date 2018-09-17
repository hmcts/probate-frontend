const initSteps = require('app/core/initSteps');
const journeyMap = require('app/core/journeyMap');
const assert = require('chai').assert;
const completedForm = require('test/data/complete-form').formdata;

describe('Tasklist', () => {
    let ctx = {};
    const req = {
        session: {
            form: {}
        },
        query: {
        }
    };
    const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui/`]);

    describe('updateTaskStatus', () => {
        it('Updates the context: neither task is started', () => {
            const taskList = steps.TaskList;
            ctx = taskList.getContextData(req);

            assert.equal(ctx.EligibilityTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
            assert.equal(ctx.EligibilityTask.status, 'notStarted');
            assert.equal(ctx.EligibilityTask.nextURL, steps[journeyMap.taskList.EligibilityTask.firstStep].constructor.getUrl());
            assert.equal(ctx.ExecutorsTask.status, 'notStarted');
            assert.equal(ctx.ExecutorsTask.nextURL, steps[journeyMap.taskList.ExecutorsTask.firstStep].constructor.getUrl());
        });

        it('Updates the context: EligibilityTask started,', () => {
            const formdata = {will: {left: 'Yes'}};
            req.session.form = formdata;
            const taskList = steps.TaskList;
            ctx = taskList.getContextData(req);

            assert.equal(ctx.EligibilityTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
            assert.equal(ctx.EligibilityTask.status, 'started');
            assert.equal(ctx.EligibilityTask.nextURL, journeyMap(steps.WillLeft, formdata.will).constructor.getUrl());
            assert.equal(ctx.ExecutorsTask.status, 'notStarted');
            assert.equal(ctx.ExecutorsTask.nextURL, steps[journeyMap.taskList.ExecutorsTask.firstStep].constructor.getUrl());
        });

        it('Updates the context: EligibilityTask complete, ExecutorsTask not started', () => {
            const formdata = {
                will: completedForm.will,
                iht: completedForm.iht,
                executors: {mentalCapacity: 'Yes'},
                applicant: {executor: completedForm.applicant.executor},
                deceased: {deathCertificate: completedForm.deceased.deathCertificate}
            };
            req.session.form = formdata;
            const taskList = steps.TaskList;
            ctx = taskList.getContextData(req);

            assert.equal(ctx.EligibilityTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
            assert.equal(ctx.EligibilityTask.status, 'complete');
            assert.equal(ctx.ExecutorsTask.status, 'notStarted');
            assert.equal(ctx.ExecutorsTask.nextURL, steps[journeyMap.taskList.ExecutorsTask.firstStep].constructor.getUrl());
        });

        it('Updates the context: EligibilityTask complete, ExecutorsTask started', () => {
            const formdata = {
                will: completedForm.will,
                iht: completedForm.iht,
                executors: {mentalCapacity: 'Yes'},
                applicant: {
                    executor: completedForm.applicant.executor,
                    firstName: completedForm.applicant.firstName,
                    lastName: completedForm.applicant.lastName,
                },
                deceased: {deathCertificate: completedForm.deceased.deathCertificate}
            };
            req.session.form = formdata;
            const taskList = steps.TaskList;
            ctx = taskList.getContextData(req);

            assert.equal(ctx.ExecutorsTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
            assert.equal(ctx.EligibilityTask.status, 'complete');
            assert.equal(ctx.ExecutorsTask.status, 'started');
            assert.equal(ctx.ExecutorsTask.nextURL, journeyMap(steps.ApplicantName, formdata.will).constructor.getUrl());
        });

        it('Updates the context: EligibilityTask & ExecutorsTask started (ExecutorsTask blocked), ', () => {
            const formdata = {
                will: completedForm.will,
                iht: {'completed': 'Yes'},
                applicant: completedForm.applicant,
                deceased: {deathCertificate: completedForm.deceased.deathCertificate}
            };
            req.session.form = formdata;
            const taskList = steps.TaskList;
            ctx = taskList.getContextData(req);

            assert.equal(ctx.EligibilityTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
            assert.equal(ctx.EligibilityTask.status, 'started');
            assert.equal(ctx.EligibilityTask.nextURL, journeyMap(steps.IhtCompleted, formdata.iht).constructor.getUrl());
            assert.equal(ctx.ExecutorsTask.status, 'started');
        });

        it('Updates the context: Review and confirm not started', () => {
            const formdata = {
                will: completedForm.will,
                iht: completedForm.iht,
                applicant: completedForm.applicant,
                deceased: completedForm.deceased,
                executors: completedForm.executors
            };
            req.session.form = formdata;
            const taskList = steps.TaskList;
            ctx = taskList.getContextData(req);

            assert.equal(ctx.ExecutorsTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
            assert.equal(ctx.EligibilityTask.status, 'complete');
            assert.equal(ctx.ExecutorsTask.status, 'complete');
            assert.equal(ctx.ExecutorsTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
            assert.equal(ctx.ReviewAndConfirmTask.status, 'notStarted');
            assert.equal(ctx.ReviewAndConfirmTask.nextURL, steps[journeyMap.taskList.ReviewAndConfirmTask.firstStep].constructor.getUrl());
        });

        it('Updates the context: Review and confirm complete (Single Applicants)', () => {
            req.session.form = {
                will: completedForm.will,
                iht: completedForm.iht,
                applicant: completedForm.applicant,
                deceased: completedForm.deceased,
                declaration: completedForm.declaration
            };
            req.body = {};
            const taskList = steps.TaskList;
            ctx = taskList.getContextData(req);

            assert.equal(ctx.ReviewAndConfirmTask.status, 'complete');
            assert.equal(ctx.CopiesTask.status, 'notStarted');
            assert.equal(ctx.CopiesTask.checkYourAnswersLink, steps.CopiesSummary.constructor.getUrl());
        });

        it('Updates the context: Review and confirm complete (Multiple Applicants All Agreed)', () => {
            req.session.form = {
                will: completedForm.will,
                iht: completedForm.iht,
                applicant: completedForm.applicant,
                deceased: completedForm.deceased,
                executors: completedForm.executors,
                declaration: completedForm.declaration
            };
            req.body = {};
            req.session.haveAllExecutorsDeclared = 'true';
            const taskList = steps.TaskList;
            ctx = taskList.getContextData(req);
            ctx.alreadyDeclared = true;
            ctx.hasMultipleApplicants = true;

            assert.equal(ctx.ReviewAndConfirmTask.status, 'complete');
            assert.equal(ctx.CopiesTask.status, 'notStarted');
            assert.equal(ctx.CopiesTask.checkYourAnswersLink, steps.CopiesSummary.constructor.getUrl());
        });

        it('Updates the context: Review and confirm complete (Multiple Applicants Not all have agreed)', () => {
            req.session.form = {
                will: completedForm.will,
                iht: completedForm.iht,
                applicant: completedForm.applicant,
                deceased: completedForm.deceased,
                executors: completedForm.executors,
                declaration: completedForm.declaration
            };
            req.body = {};
            req.session.haveAllExecutorsDeclared = 'false';
            const taskList = steps.TaskList;
            ctx = taskList.getContextData(req);

            assert.equal(ctx.ReviewAndConfirmTask.status, 'complete');
            assert.equal(ctx.previousTaskStatus.CopiesTask, 'locked');
        });

        it('Updates the context: CopiesTask not started', () => {
            req.session.form = {};
            req.body = {};
            const taskList = steps.TaskList;
            ctx = taskList.getContextData(req);

            assert.equal(ctx.CopiesTask.checkYourAnswersLink, steps.CopiesSummary.constructor.getUrl());
            assert.equal(ctx.CopiesTask.status, 'notStarted');
        });

        it('Updates the context: CopiesTask started', () => {
            req.session.form = {
                copies: {
                    uk: 1
                }
            };
            req.body = {};
            const taskList = steps.TaskList;
            ctx = taskList.getContextData(req);

            assert.equal(ctx.CopiesTask.checkYourAnswersLink, steps.CopiesSummary.constructor.getUrl());
            assert.equal(ctx.CopiesTask.status, 'started');
        });

        it('Updates the context: CopiesTask complete', () => {
            req.session.form = completedForm;
            req.body = {};
            const taskList = steps.TaskList;
            ctx = taskList.getContextData(req);

            assert.equal(ctx.CopiesTask.checkYourAnswersLink, steps.CopiesSummary.constructor.getUrl());
            assert.equal(ctx.CopiesTask.status, 'complete');
        });

        it('Updates the context: PaymentTask not started', () => {
            req.session.form = {};
            req.body = {};
            const taskList = steps.TaskList;
            ctx = taskList.getContextData(req);

            assert.equal(ctx.PaymentTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
            assert.equal(ctx.PaymentTask.status, 'notStarted');
        });

        it('Updates the context: PaymentTask started (Fee to Pay)', () => {
            req.session.form = {
               paymentPending: 'true'
            };
            req.body = {};
            const taskList = steps.TaskList;
            ctx = taskList.getContextData(req);

            assert.equal(ctx.PaymentTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
            assert.equal(ctx.PaymentTask.status, 'started');
        });

        it('Updates the context: PaymentTask started (No Fee)', () => {
            req.session.form = {
               paymentPending: 'false'
            };
            req.body = {};
            const taskList = steps.TaskList;
            ctx = taskList.getContextData(req);

            assert.equal(ctx.PaymentTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
            assert.equal(ctx.PaymentTask.status, 'started');
        });

        it('Updates the context: PaymentTask complete', () => {
            req.session.form = {
                paymentPending: 'false',
                submissionReference: true
            };
            req.body = {};
            const taskList = steps.TaskList;
            ctx = taskList.getContextData(req);

            assert.equal(ctx.PaymentTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
            assert.equal(ctx.PaymentTask.status, 'complete');
        });

        it('Updates the context: Eligibility, Executors, Review and confirm, Copies and Document tasks complete', () => {
            req.session.form = completedForm;
            req.session.form.documents = {
                sentDocuments: 'true'
            };
            req.body = {};
            const taskList = steps.TaskList;
            ctx = taskList.getContextData(req);

            assert.equal(ctx.DocumentsTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
            assert.equal(ctx.EligibilityTask.status, 'complete');
            assert.equal(ctx.ExecutorsTask.status, 'complete');
            assert.equal(ctx.ReviewAndConfirmTask.status, 'complete');
            assert.equal(ctx.DocumentsTask.status, 'complete');
        });
    });
});
