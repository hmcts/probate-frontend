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

            assert.equal(ctx.DeceasedTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
            assert.equal(ctx.DeceasedTask.status, 'notStarted');
            assert.equal(ctx.DeceasedTask.nextURL, steps[journeyMap.taskList.DeceasedTask.firstStep].constructor.getUrl());
            assert.equal(ctx.ExecutorsTask.status, 'notStarted');
            assert.equal(ctx.ExecutorsTask.nextURL, steps[journeyMap.taskList.ExecutorsTask.firstStep].constructor.getUrl());
        });
        it('Updates the context: DeceasedTask started', () => {
            const formdata = {
                deceased: {
                    firstName: completedForm.deceased.firstName,
                    lastName: completedForm.deceased.lastName
                }
            };
            req.session.form = formdata;
            const taskList = steps.TaskList;
            ctx = taskList.getContextData(req);
            assert.equal(ctx.DeceasedTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
            assert.equal(ctx.DeceasedTask.status, 'started');
            assert.equal(ctx.DeceasedTask.nextURL, journeyMap(steps.DeceasedName, formdata.deceased).constructor.getUrl());
            assert.equal(ctx.ExecutorsTask.status, 'notStarted');
            assert.equal(ctx.ExecutorsTask.nextURL, steps[journeyMap.taskList.ExecutorsTask.firstStep].constructor.getUrl());
        });
        it('Updates the context: DeceasedTask complete, ExecutorsTask not started', () => {
            const formdata = {
                deceased: {
                    firstName: completedForm.deceased.firstName,
                    lastName: completedForm.deceased.lastName,
                    dob_day: completedForm.deceased.dob_day,
                    dob_month: completedForm.deceased.dob_month,
                    dob_year: completedForm.deceased.dob_year,
                    dod_day: completedForm.deceased.dod_day,
                    dod_month: completedForm.deceased.dod_month,
                    dod_year: completedForm.deceased.dod_year,
                    freeTextAddress: completedForm.deceased.freeTextAddress,
                    alias: completedForm.deceased.alias,
                    married: completedForm.deceased.married
                },
                iht: {
                    method: completedForm.iht.method,
                    identifier: completedForm.iht.identifier,
                    grossValueOnline: completedForm.iht.grossValueOnline,
                    netValueOnline: completedForm.iht.netValueOnline
                },
                will: {
                    codicils: completedForm.will.codicils
                }
            };
            req.session.form = formdata;
            const taskList = steps.TaskList;
            ctx = taskList.getContextData(req);
            assert.equal(ctx.DeceasedTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
            assert.equal(ctx.DeceasedTask.status, 'complete');
            assert.equal(ctx.ExecutorsTask.status, 'notStarted');
            assert.equal(ctx.ExecutorsTask.nextURL, steps[journeyMap.taskList.ExecutorsTask.firstStep].constructor.getUrl());
        });
        it('Updates the context: DeceasedTask complete, ExecutorsTask started', () => {
            const formdata = {
                deceased: {
                    firstName: completedForm.deceased.firstName,
                    lastName: completedForm.deceased.lastName,
                    dob_day: completedForm.deceased.dob_day,
                    dob_month: completedForm.deceased.dob_month,
                    dob_year: completedForm.deceased.dob_year,
                    dod_day: completedForm.deceased.dod_day,
                    dod_month: completedForm.deceased.dod_month,
                    dod_year: completedForm.deceased.dod_year,
                    freeTextAddress: completedForm.deceased.freeTextAddress,
                    alias: completedForm.deceased.alias,
                    married: completedForm.deceased.married
                },
                iht: {
                    method: completedForm.iht.method,
                    identifier: completedForm.iht.identifier,
                    grossValueOnline: completedForm.iht.grossValueOnline,
                    netValueOnline: completedForm.iht.netValueOnline
                },
                will: {
                    codicils: completedForm.will.codicils
                },
                applicant: {
                    firstName: completedForm.applicant.firstName,
                    lastName: completedForm.applicant.lastName
                }
            };
            req.session.form = formdata;
            const taskList = steps.TaskList;
            ctx = taskList.getContextData(req);
            assert.equal(ctx.ExecutorsTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
            assert.equal(ctx.DeceasedTask.status, 'complete');
            assert.equal(ctx.ExecutorsTask.status, 'started');
            assert.equal(ctx.ExecutorsTask.nextURL, journeyMap(steps.ApplicantName, formdata.will).constructor.getUrl());
        });
        it('Updates the context: DeceasedTask & ExecutorsTask started (ExecutorsTask blocked)', () => {
            const formdata = {
                deceased: {
                    firstName: completedForm.deceased.firstName,
                    lastName: completedForm.deceased.lastName,
                    dob_day: completedForm.deceased.dob_day,
                    dob_month: completedForm.deceased.dob_month,
                    dob_year: completedForm.deceased.dob_year,
                    dod_day: completedForm.deceased.dod_day,
                    dod_month: completedForm.deceased.dod_month,
                    dod_year: completedForm.deceased.dod_year,
                    freeTextAddress: completedForm.deceased.freeTextAddress,
                    alias: completedForm.deceased.alias,
                    married: completedForm.deceased.married
                },
                iht: {
                    method: completedForm.iht.method,
                    identifier: completedForm.iht.identifier,
                    grossValueOnline: completedForm.iht.grossValueOnline,
                    netValueOnline: completedForm.iht.netValueOnline
                },
                applicant: {
                    firstName: completedForm.applicant.firstName,
                    lastName: completedForm.applicant.lastName
                }
            };
            req.session.form = formdata;
            const taskList = steps.TaskList;
            ctx = taskList.getContextData(req);
            assert.equal(ctx.DeceasedTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
            assert.equal(ctx.DeceasedTask.status, 'started');
            assert.equal(ctx.DeceasedTask.nextURL, journeyMap(steps.DeceasedMarried, formdata.deceased).constructor.getUrl());
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
            assert.equal(ctx.DeceasedTask.status, 'complete');
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
        it('Updates the context: Deceased, Executors, Review and confirm, Copies and Document tasks complete', () => {
            req.session.form = completedForm;
            req.session.form.documents = {
                sentDocuments: 'true'
            };
            req.body = {};
            const taskList = steps.TaskList;
            ctx = taskList.getContextData(req);
            assert.equal(ctx.DocumentsTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
            assert.equal(ctx.DeceasedTask.status, 'complete');
            assert.equal(ctx.ExecutorsTask.status, 'complete');
            assert.equal(ctx.ReviewAndConfirmTask.status, 'complete');
            assert.equal(ctx.DocumentsTask.status, 'complete');
        });
    });
});
