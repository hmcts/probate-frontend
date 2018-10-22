// eslint-disable-line max-lines
'use strict';

const initSteps = require('app/core/initSteps');
const journeyMap = require('app/core/journeyMap');
const {expect, assert} = require('chai');
const completedForm = require('test/data/complete-form').formdata;
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui/`]);
const taskList = steps.TaskList;

describe('Tasklist', () => {
    let ctx = {};
    const req = {
        session: {
            form: {}
        },
        query: {
        }
    };

    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = taskList.constructor.getUrl();
            expect(url).to.equal('/tasklist');
            done();
        });
    });

    describe('updateTaskStatus', () => {
        it('Updates the context: neither task is started', () => {
            ctx = taskList.getContextData(req);

            assert.equal(ctx.DeceasedTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
            assert.equal(ctx.DeceasedTask.status, 'notStarted');
            assert.equal(ctx.DeceasedTask.nextURL, steps[journeyMap.taskList.DeceasedTask.firstStep].constructor.getUrl());
            assert.equal(ctx.ExecutorsTask.status, 'notStarted');
            assert.equal(ctx.ExecutorsTask.nextURL, steps[journeyMap.taskList.ExecutorsTask.firstStep].constructor.getUrl());
        });

        it('Updates the context: DeceasedTask started', () => {
            const formdata = {deceased: {firstName: 'Test first name', lastName: 'Test last name'}};
            req.session.form = formdata;
            ctx = taskList.getContextData(req);

            assert.equal(ctx.DeceasedTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
            assert.equal(ctx.DeceasedTask.status, 'started');
            assert.equal(ctx.DeceasedTask.nextURL, journeyMap(steps.DeceasedName, formdata.deceased).constructor.getUrl());
            assert.equal(ctx.ExecutorsTask.status, 'notStarted');
            assert.equal(ctx.ExecutorsTask.nextURL, steps[journeyMap.taskList.ExecutorsTask.firstStep].constructor.getUrl());
        });

        it('Updates the context: DeceasedTask complete, ExecutorsTask not started', () => {
            const formdata = {
                deceased: completedForm.deceased,
                iht: completedForm.iht,
                will: completedForm.will
            };
            req.session.form = formdata;
            ctx = taskList.getContextData(req);

            assert.equal(ctx.DeceasedTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
            assert.equal(ctx.DeceasedTask.status, 'complete');
            assert.equal(ctx.ExecutorsTask.status, 'notStarted');
            assert.equal(ctx.ExecutorsTask.nextURL, steps[journeyMap.taskList.ExecutorsTask.firstStep].constructor.getUrl());
        });

        it('Updates the context: DeceasedTask complete, ExecutorsTask started', () => {
            const formdata = {
                deceased: completedForm.deceased,
                iht: completedForm.iht,
                will: completedForm.will,
                applicant: {
                    firstName: completedForm.applicant.firstName,
                    lastName: completedForm.applicant.lastName
                }
            };
            req.session.form = formdata;
            ctx = taskList.getContextData(req);

            assert.equal(ctx.ExecutorsTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
            assert.equal(ctx.DeceasedTask.status, 'complete');
            assert.equal(ctx.ExecutorsTask.status, 'started');
            assert.equal(ctx.ExecutorsTask.nextURL, journeyMap(steps.ApplicantName, formdata.will).constructor.getUrl());
        });

        it('Updates the context: DeceasedTask & ExecutorsTask started (ExecutorsTask blocked)', () => {
            const formdata = {
                deceased: {firstName: 'Test first name', lastName: 'Test last name'},
                applicant: {
                    firstName: completedForm.applicant.firstName,
                    lastName: completedForm.applicant.lastName
                }
            };
            req.session.form = formdata;
            ctx = taskList.getContextData(req);

            assert.equal(ctx.DeceasedTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
            assert.equal(ctx.DeceasedTask.status, 'started');
            assert.equal(ctx.DeceasedTask.nextURL, journeyMap(steps.DeceasedName, formdata.deceased).constructor.getUrl());
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
            ctx = taskList.getContextData(req);

            assert.equal(ctx.ReviewAndConfirmTask.status, 'complete');
            assert.equal(ctx.previousTaskStatus.CopiesTask, 'locked');
        });

        it('Updates the context: CopiesTask not started', () => {
            req.session.form = {};
            req.body = {};
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
            ctx = taskList.getContextData(req);

            assert.equal(ctx.CopiesTask.checkYourAnswersLink, steps.CopiesSummary.constructor.getUrl());
            assert.equal(ctx.CopiesTask.status, 'started');
        });

        it('Updates the context: CopiesTask complete', () => {
            req.session.form = completedForm;
            req.body = {};
            ctx = taskList.getContextData(req);

            assert.equal(ctx.CopiesTask.checkYourAnswersLink, steps.CopiesSummary.constructor.getUrl());
            assert.equal(ctx.CopiesTask.status, 'complete');
        });

        it('Updates the context: PaymentTask not started', () => {
            req.session.form = {};
            req.body = {};
            ctx = taskList.getContextData(req);

            assert.equal(ctx.PaymentTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
            assert.equal(ctx.PaymentTask.status, 'notStarted');
        });

        it('Updates the context: PaymentTask started (Fee to Pay)', () => {
            req.session.form = {
                paymentPending: 'true'
            };
            req.body = {};
            ctx = taskList.getContextData(req);

            assert.equal(ctx.PaymentTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
            assert.equal(ctx.PaymentTask.status, 'started');
        });

        it('Updates the context: PaymentTask started (No Fee)', () => {
            req.session.form = {
                paymentPending: 'false'
            };
            req.body = {};
            ctx = taskList.getContextData(req);

            assert.equal(ctx.PaymentTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
            assert.equal(ctx.PaymentTask.status, 'started');
        });

        it('Updates the context: PaymentTask complete', () => {
            req.session.form = {
                ccdCase: {
                    state: 'CaseCreated',
                    id: 1535395401245028
                },
                paymentPending: 'false',
                payment: {
                    status: 'Success'
                }
            };
            req.body = {};
            ctx = taskList.getContextData(req);

            assert.equal(ctx.PaymentTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
            assert.equal(ctx.PaymentTask.status, 'complete');
        });

        it('Updates the context: DeceasedTask, Executors, Review and confirm, Copies and Document tasks complete', () => {
            req.session.form = completedForm;
            req.session.form.documents = {
                sentDocuments: 'true'
            };
            req.body = {};
            ctx = taskList.getContextData(req);

            assert.equal(ctx.DocumentsTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
            assert.equal(ctx.DeceasedTask.status, 'complete');
            assert.equal(ctx.ExecutorsTask.status, 'complete');
            assert.equal(ctx.ReviewAndConfirmTask.status, 'complete');
            assert.equal(ctx.DocumentsTask.status, 'complete');
        });

        it('Test the Copies Previous Task Status is set correctly', () => {
            req.session.form = completedForm;

            ctx = taskList.getContextData(req);

            assert.equal(ctx.CopiesTask.status, 'complete');
        });
    });

    describe('action', () => {
        it('test it cleans up context', () => {
            const ctx = {
                hasMultipleApplicants: true,
                alreadyDeclared: true,
                previousTaskStatus: 'complete'
            };

            taskList.action(ctx);
            assert.isUndefined(ctx.hasMultipleApplicants);
            assert.isUndefined(ctx.alreadyDeclared);
            assert.isUndefined(ctx.previousTaskStatus);
        });
    });
});
