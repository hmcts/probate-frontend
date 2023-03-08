// eslint-disable-line max-lines

'use strict';

const initSteps = require('app/core/initSteps');
const JourneyMap = require('app/core/JourneyMap');
const {expect, assert} = require('chai');
const completedForm = require('test/data/complete-form').formdata;
const completedFormWillConditionOn = require('test/data/complete-form-will-condition-toggle-on.json').formdata;
const journeyProbate = require('app/journeys/probate');
const journeyIntestacy = require('app/journeys/intestacy');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const taskList = steps.TaskList;
const caseTypes = require('app/utils/CaseTypes');

describe('Tasklist', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = taskList.constructor.getUrl();
            expect(url).to.equal('/task-list');
            done();
        });
    });

    describe('updateTaskStatus()', () => {
        let journeyMap;

        describe('Probate Journey - will condition FT = OFF', () => {
            let ctx = {};
            const req = {
                session: {
                    form: {},
                    featureToggles: {'ft_will_condition': false}
                },
                query: {}
            };

            beforeEach(() => {
                req.session.journey = journeyProbate;
                journeyMap = new JourneyMap(journeyProbate);
            });

            it('Updates the context: neither task is started', () => {
                ctx = taskList.getContextData(req);

                assert.equal(ctx.DeceasedTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
                assert.equal(ctx.DeceasedTask.status, 'notStarted');
                assert.equal(ctx.DeceasedTask.nextURL, steps[journeyMap.taskList().DeceasedTask.firstStep].constructor.getUrl());
                assert.equal(ctx.ExecutorsTask.status, 'notStarted');
                assert.equal(ctx.ExecutorsTask.nextURL, steps[journeyMap.taskList().ExecutorsTask.firstStep].constructor.getUrl());
            });

            it('Updates the context: DeceasedTask started', () => {
                const formdata = {language: {bilingual: 'optionNo'}, deceased: {firstName: 'Test first name', lastName: 'Test last name'}};
                req.session.form = formdata;
                ctx = taskList.getContextData(req);
                ctx = Object.assign(ctx, formdata.deceased);

                assert.equal(ctx.DeceasedTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
                assert.equal(ctx.DeceasedTask.status, 'started');
                assert.equal(ctx.DeceasedTask.nextURL, journeyMap.nextStep(steps.DeceasedName, ctx).constructor.getUrl());
                assert.equal(ctx.ExecutorsTask.status, 'notStarted');
                assert.equal(ctx.ExecutorsTask.nextURL, steps[journeyMap.taskList().ExecutorsTask.firstStep].constructor.getUrl());
            });

            it('Updates the context: DeceasedTask complete, ExecutorsTask not started', () => {
                const formdata = {
                    language: {bilingual: 'optionNo'},
                    deceased: completedForm.deceased,
                    will: completedForm.will,
                    iht: completedForm.iht,
                    documentupload: {},
                    documents: {
                        uploads: completedForm.documents.uploads
                    }
                };
                req.session.form = formdata;
                ctx = taskList.getContextData(req);

                assert.equal(ctx.DeceasedTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
                assert.equal(ctx.DeceasedTask.status, 'complete');
                assert.equal(ctx.ExecutorsTask.status, 'notStarted');
                assert.equal(ctx.ExecutorsTask.nextURL, steps[journeyMap.taskList().ExecutorsTask.firstStep].constructor.getUrl());
            });

            it('Updates the context: DeceasedTask complete, ExecutorsTask started', () => {
                const formdata = {
                    language: {bilingual: 'optionNo'},
                    deceased: completedForm.deceased,
                    will: completedForm.will,
                    iht: completedForm.iht,
                    documentupload: {},
                    documents: {
                        uploads: completedForm.documents.uploads
                    },
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
                assert.equal(ctx.ExecutorsTask.nextURL, journeyMap.nextStep(steps.ApplicantName, formdata.will).constructor.getUrl());
            });

            it('Updates the context: DeceasedTask & ExecutorsTask started (ExecutorsTask blocked)', () => {
                const formdata = {
                    language: {bilingual: 'optionNo'},
                    deceased: {firstName: 'Test first name', lastName: 'Test last name'},
                    applicant: {
                        firstName: completedForm.applicant.firstName,
                        lastName: completedForm.applicant.lastName
                    }
                };
                req.session.form = formdata;
                ctx = taskList.getContextData(req);
                ctx = Object.assign(ctx, formdata.deceased);

                assert.equal(ctx.DeceasedTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
                assert.equal(ctx.DeceasedTask.status, 'started');
                assert.equal(ctx.DeceasedTask.nextURL, journeyMap.nextStep(steps.DeceasedName, ctx).constructor.getUrl());
                assert.equal(ctx.ExecutorsTask.status, 'started');
            });

            it('Updates the context: Review and confirm not started', () => {
                const formdata = {
                    language: {bilingual: 'optionNo'},
                    will: completedForm.will,
                    iht: completedForm.iht,
                    documentupload: {},
                    documents: {
                        uploads: completedForm.documents.uploads
                    },
                    applicant: completedForm.applicant,
                    deceased: completedForm.deceased,
                    executors: completedForm.executors,
                    equality: {
                        pcqId: 'dummy_id'
                    }
                };
                req.session.form = formdata;
                ctx = taskList.getContextData(req);

                assert.equal(ctx.ExecutorsTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
                assert.equal(ctx.DeceasedTask.status, 'complete');
                assert.equal(ctx.ExecutorsTask.status, 'complete');
                assert.equal(ctx.ExecutorsTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
                assert.equal(ctx.ReviewAndConfirmTask.status, 'notStarted');
                assert.equal(ctx.ReviewAndConfirmTask.nextURL, steps[journeyMap.taskList().ReviewAndConfirmTask.firstStep].constructor.getUrl());
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
                    payment: {
                        reference: '1234'
                    },
                    ccdCase: {
                        state: 'PAAppCreated',
                        id: 1535395401245028
                    }
                };
                req.body = {};
                ctx = taskList.getContextData(req);

                assert.equal(ctx.PaymentTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
                assert.equal(ctx.PaymentTask.status, 'started');
            });

            it('Updates the context: PaymentTask started (No Fee)', () => {
                req.session.form = {
                    payment: {
                        total: 0,
                    },
                    ccdCase: {
                        state: 'PAAppCreated',
                        id: 1535395401245028
                    }
                };
                req.body = {};
                ctx = taskList.getContextData(req);

                assert.equal(ctx.PaymentTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
                assert.equal(ctx.PaymentTask.status, 'started');
            });

            it('Updates the context: PaymentTask complete', () => {
                req.session.form = {
                    ccdCase: {
                        state: 'CasePrinted',
                        id: 1535395401245028
                    },
                    payment: {
                        status: 'Success',
                        reference: '1234'
                    }
                };
                req.body = {};
                ctx = taskList.getContextData(req);

                assert.equal(ctx.PaymentTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
                assert.equal(ctx.PaymentTask.status, 'complete');
            });

            it('Updates the context: DeceasedTask, Executors, Review and confirm, Copies and Document tasks complete', () => {
                req.session.form = completedForm;
                req.session.form.language = {bilingual: 'optionNo'};
                req.session.form.documentupload = {};
                req.session.form.documents.sentDocuments = 'true';
                req.session.form.equality = {
                    pcqId: 'dummy_id'
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

        describe('Probate Journey - will condition FT = ON', () => {
            let ctx = {};
            const req = {
                session: {
                    form: {},
                },
                featureToggles: {'ft_will_condition': true},
                query: {}
            };

            beforeEach(() => {
                req.session.journey = journeyProbate;
                journeyMap = new JourneyMap(journeyProbate);
            });

            it('Updates the context: neither task is started', () => {
                ctx = taskList.getContextData(req);

                assert.equal(ctx.DeceasedTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
                assert.equal(ctx.DeceasedTask.status, 'notStarted');
                assert.equal(ctx.DeceasedTask.nextURL, steps[journeyMap.taskList().DeceasedTask.firstStep].constructor.getUrl());
                assert.equal(ctx.ExecutorsTask.status, 'notStarted');
                assert.equal(ctx.ExecutorsTask.nextURL, steps[journeyMap.taskList().ExecutorsTask.firstStep].constructor.getUrl());
            });

            it('Updates the context: DeceasedTask started', () => {
                const formdata = {language: {bilingual: 'optionNo'}, deceased: {firstName: 'Test first name', lastName: 'Test last name'}};
                req.session.form = formdata;
                ctx = taskList.getContextData(req);
                ctx = Object.assign(ctx, formdata.deceased);

                assert.equal(ctx.DeceasedTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
                assert.equal(ctx.DeceasedTask.status, 'started');
                assert.equal(ctx.DeceasedTask.nextURL, journeyMap.nextStep(steps.DeceasedName, ctx).constructor.getUrl());
                assert.equal(ctx.ExecutorsTask.status, 'notStarted');
                assert.equal(ctx.ExecutorsTask.nextURL, steps[journeyMap.taskList().ExecutorsTask.firstStep].constructor.getUrl());
            });

            it('Updates the context: DeceasedTask complete, ExecutorsTask not started', () => {
                const formdata = {
                    language: {bilingual: 'optionNo'},
                    deceased: completedFormWillConditionOn.deceased,
                    will: completedFormWillConditionOn.will,
                    iht: completedFormWillConditionOn.iht,
                    documentupload: {},
                    documents: {
                        uploads: completedFormWillConditionOn.documents.uploads
                    }
                };
                req.session.form = formdata;
                ctx = taskList.getContextData(req);

                assert.equal(ctx.DeceasedTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
                assert.equal(ctx.DeceasedTask.status, 'complete');
                assert.equal(ctx.ExecutorsTask.status, 'notStarted');
                assert.equal(ctx.ExecutorsTask.nextURL, steps[journeyMap.taskList().ExecutorsTask.firstStep].constructor.getUrl());
            });

            it('Updates the context: DeceasedTask complete, ExecutorsTask started', () => {
                const formdata = {
                    language: {bilingual: 'optionNo'},
                    deceased: completedFormWillConditionOn.deceased,
                    will: completedFormWillConditionOn.will,
                    iht: completedFormWillConditionOn.iht,
                    documentupload: {},
                    documents: {
                        uploads: completedFormWillConditionOn.documents.uploads
                    },
                    applicant: {
                        firstName: completedFormWillConditionOn.applicant.firstName,
                        lastName: completedFormWillConditionOn.applicant.lastName
                    }
                };
                req.session.form = formdata;
                ctx = taskList.getContextData(req);

                assert.equal(ctx.ExecutorsTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
                assert.equal(ctx.DeceasedTask.status, 'complete');
                assert.equal(ctx.ExecutorsTask.status, 'started');
                assert.equal(ctx.ExecutorsTask.nextURL, journeyMap.nextStep(steps.ApplicantName, formdata.will).constructor.getUrl());
            });

            it('Updates the context: DeceasedTask & ExecutorsTask started (ExecutorsTask blocked)', () => {
                const formdata = {
                    language: {bilingual: 'optionNo'},
                    deceased: {firstName: 'Test first name', lastName: 'Test last name'},
                    applicant: {
                        firstName: completedFormWillConditionOn.applicant.firstName,
                        lastName: completedFormWillConditionOn.applicant.lastName
                    }
                };
                req.session.form = formdata;
                ctx = taskList.getContextData(req);
                ctx = Object.assign(ctx, formdata.deceased);

                assert.equal(ctx.DeceasedTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
                assert.equal(ctx.DeceasedTask.status, 'started');
                assert.equal(ctx.DeceasedTask.nextURL, journeyMap.nextStep(steps.DeceasedName, ctx).constructor.getUrl());
                assert.equal(ctx.ExecutorsTask.status, 'started');
            });

            it('Updates the context: Review and confirm not started', () => {
                const formdata = {
                    language: {bilingual: 'optionNo'},
                    will: completedFormWillConditionOn.will,
                    iht: completedFormWillConditionOn.iht,
                    documentupload: {},
                    documents: {
                        uploads: completedFormWillConditionOn.documents.uploads
                    },
                    applicant: completedFormWillConditionOn.applicant,
                    deceased: completedFormWillConditionOn.deceased,
                    executors: completedFormWillConditionOn.executors,
                    equality: {
                        pcqId: 'dummy_id'
                    }
                };
                req.session.form = formdata;
                ctx = taskList.getContextData(req);

                assert.equal(ctx.ExecutorsTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
                assert.equal(ctx.DeceasedTask.status, 'complete');
                assert.equal(ctx.ExecutorsTask.status, 'complete');
                assert.equal(ctx.ExecutorsTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
                assert.equal(ctx.ReviewAndConfirmTask.status, 'notStarted');
                assert.equal(ctx.ReviewAndConfirmTask.nextURL, steps[journeyMap.taskList().ReviewAndConfirmTask.firstStep].constructor.getUrl());
            });

            it('Updates the context: Review and confirm complete (Single Applicants)', () => {
                req.session.form = {
                    will: completedFormWillConditionOn.will,
                    iht: completedFormWillConditionOn.iht,
                    applicant: completedFormWillConditionOn.applicant,
                    deceased: completedFormWillConditionOn.deceased,
                    declaration: completedFormWillConditionOn.declaration
                };
                req.body = {};
                ctx = taskList.getContextData(req);

                assert.equal(ctx.ReviewAndConfirmTask.status, 'complete');
                assert.equal(ctx.CopiesTask.status, 'notStarted');
                assert.equal(ctx.CopiesTask.checkYourAnswersLink, steps.CopiesSummary.constructor.getUrl());
            });

            it('Updates the context: Review and confirm complete (Multiple Applicants All Agreed)', () => {
                req.session.form = {
                    will: completedFormWillConditionOn.will,
                    iht: completedFormWillConditionOn.iht,
                    applicant: completedFormWillConditionOn.applicant,
                    deceased: completedFormWillConditionOn.deceased,
                    executors: completedFormWillConditionOn.executors,
                    declaration: completedFormWillConditionOn.declaration
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
                    will: completedFormWillConditionOn.will,
                    iht: completedFormWillConditionOn.iht,
                    applicant: completedFormWillConditionOn.applicant,
                    deceased: completedFormWillConditionOn.deceased,
                    executors: completedFormWillConditionOn.executors,
                    declaration: completedFormWillConditionOn.declaration
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
                req.session.form = completedFormWillConditionOn;
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
                    payment: {
                        reference: '1234'
                    },
                    ccdCase: {
                        state: 'PAAppCreated',
                        id: 1535395401245028
                    }
                };
                req.body = {};
                ctx = taskList.getContextData(req);

                assert.equal(ctx.PaymentTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
                assert.equal(ctx.PaymentTask.status, 'started');
            });

            it('Updates the context: PaymentTask started (No Fee)', () => {
                req.session.form = {
                    payment: {
                        total: 0,
                    },
                    ccdCase: {
                        state: 'PAAppCreated',
                        id: 1535395401245028
                    }
                };
                req.body = {};
                ctx = taskList.getContextData(req);

                assert.equal(ctx.PaymentTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
                assert.equal(ctx.PaymentTask.status, 'started');
            });

            it('Updates the context: PaymentTask complete', () => {
                req.session.form = {
                    ccdCase: {
                        state: 'CasePrinted',
                        id: 1535395401245028
                    },
                    payment: {
                        status: 'Success',
                        reference: '1234'
                    }
                };
                req.body = {};
                ctx = taskList.getContextData(req);

                assert.equal(ctx.PaymentTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
                assert.equal(ctx.PaymentTask.status, 'complete');
            });

            it('Updates the context: DeceasedTask, Executors, Review and confirm, Copies and Document tasks complete', () => {
                req.session.form = completedFormWillConditionOn;
                req.session.form.language = {bilingual: 'optionNo'};
                req.session.form.documentupload = {};
                req.session.form.documents.sentDocuments = 'true';
                req.session.form.equality = {
                    pcqId: 'dummy_id'
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
                req.session.form = completedFormWillConditionOn;
                ctx = taskList.getContextData(req);

                assert.equal(ctx.CopiesTask.status, 'complete');
            });
        });

        describe('Intestacy Journey', () => {
            let ctx = {};
            const req = {
                session: {
                    form: {}
                },
                query: {}
            };

            beforeEach(() => {
                req.session.journey = journeyIntestacy;
                journeyMap = new JourneyMap(journeyIntestacy);
            });

            it('Updates the context: neither task is started', () => {
                ctx = taskList.getContextData(req);

                assert.equal(ctx.DeceasedTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
                assert.equal(ctx.DeceasedTask.status, 'notStarted');
                assert.equal(ctx.DeceasedTask.nextURL, steps[journeyMap.taskList().DeceasedTask.firstStep].constructor.getUrl());
                assert.equal(ctx.ApplicantsTask.status, 'notStarted');
                assert.equal(ctx.ApplicantsTask.nextURL, steps[journeyMap.taskList().ApplicantsTask.firstStep].constructor.getUrl());
            });

            it('Updates the context: DeceasedTask started', () => {
                const formdata = {
                    language: {
                        bilingual: 'optionNo'
                    },
                    deceased: {
                        'firstName': 'Test first name',
                        'lastName': 'Test last name',
                        'dob-day': 1,
                        'dob-month': 2,
                        'dob-year': 1900,
                        'dob-date': '1900-02-01T00:00:00.000Z',
                        'dob-formattedDate': '1 February 1900',
                        'dod-day': 2,
                        'dod-month': 3,
                        'dod-year': 2015,
                        'dod-date': '2010-03-02T00:00:00.000Z',
                        'dod-formattedDate': '1 February 2000'
                    }
                };
                req.session.form = formdata;
                ctx = taskList.getContextData(req);
                ctx = Object.assign(ctx, formdata.deceased);

                assert.equal(ctx.DeceasedTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
                assert.equal(ctx.DeceasedTask.status, 'started');
                assert.equal(ctx.DeceasedTask.nextURL, journeyMap.nextStep(steps.DeceasedDetails, ctx).constructor.getUrl());
                assert.equal(ctx.ApplicantsTask.status, 'notStarted');
                assert.equal(ctx.ApplicantsTask.nextURL, steps[journeyMap.taskList().ApplicantsTask.firstStep].constructor.getUrl());
            });

            it('Updates the context: DeceasedTask complete, ApplicantsTask not started', () => {
                const formdata = {
                    caseType: caseTypes.INTESTACY,
                    language: {
                        bilingual: 'optionNo'
                    },
                    deceased: completedForm.deceased,
                    will: completedForm.will,
                    iht: completedForm.iht,
                    documentupload: {},
                    documents: {
                        uploads: completedForm.documents.uploads
                    }
                };
                req.session.form = formdata;
                ctx = taskList.getContextData(req);

                assert.equal(ctx.DeceasedTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
                assert.equal(ctx.DeceasedTask.status, 'complete');
                assert.equal(ctx.ApplicantsTask.status, 'notStarted');
                assert.equal(ctx.ApplicantsTask.nextURL, steps[journeyMap.taskList().ApplicantsTask.firstStep].constructor.getUrl());
            });

            it('Updates the context: DeceasedTask complete, ApplicantsTask started', () => {
                const formdata = {
                    caseType: caseTypes.INTESTACY,
                    language: {
                        bilingual: 'optionNo'
                    },
                    deceased: completedForm.deceased,
                    iht: completedForm.iht,
                    documentupload: {},
                    documents: {
                        uploads: completedForm.documents.uploads
                    },
                    applicant: {
                        relationshipToDeceased: completedForm.applicant.relationshipToDeceased,
                        assetsValue: 300000.6
                    }
                };
                req.session.form = formdata;
                ctx = taskList.getContextData(req);

                const nextUrlCtx = formdata.applicant;
                nextUrlCtx.ihtThreshold = 250000;

                assert.equal(ctx.ApplicantsTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
                assert.equal(ctx.DeceasedTask.status, 'complete');
                assert.equal(ctx.ApplicantsTask.status, 'started');
                assert.equal(ctx.ApplicantsTask.nextURL, journeyMap.nextStep(steps.RelationshipToDeceased, nextUrlCtx).constructor.getUrl());
            });

            it('Updates the context: DeceasedTask & ApplicantsTask started (ApplicantsTask blocked)', () => {
                const formdata = {
                    language: {
                        bilingual: 'optionNo'
                    },
                    deceased: {
                        firstName: 'Test first name',
                        lastName: 'Test last name',
                        'dob-day': 1,
                        'dob-month': 2,
                        'dob-year': 1900,
                        'dob-date': '1900-02-01T00:00:00.000Z',
                        'dob-formattedDate': '1 February 1900',
                        'dod-day': 2,
                        'dod-month': 3,
                        'dod-year': 2015,
                        'dod-date': '2010-03-02T00:00:00.000Z',
                        'dod-formattedDate': '1 February 2000'
                    },
                    applicant: {
                        relationshipToDeceased: completedForm.applicant.relationshipToDeceased
                    }
                };
                req.session.form = formdata;
                ctx = taskList.getContextData(req);
                ctx = Object.assign(ctx, formdata.deceased);

                assert.equal(ctx.DeceasedTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
                assert.equal(ctx.DeceasedTask.status, 'started');
                assert.equal(ctx.DeceasedTask.nextURL, journeyMap.nextStep(steps.DeceasedDetails, ctx).constructor.getUrl());
                assert.equal(ctx.ApplicantsTask.status, 'started');
            });

            it('Updates the context: Review and confirm not started', () => {
                const formdata = {
                    caseType: caseTypes.INTESTACY,
                    language: {
                        bilingual: 'optionNo'
                    },
                    will: completedForm.will,
                    iht: completedForm.iht,
                    documentupload: {},
                    documents: {
                        uploads: completedForm.documents.uploads
                    },
                    applicant: completedForm.applicant,
                    deceased: completedForm.deceased,
                    executors: completedForm.executors,
                    equality: {
                        pcqId: 'dummy_id'
                    }
                };
                formdata.deceased.anyChildren = 'optionNo';
                req.session.form = formdata;
                ctx = taskList.getContextData(req);

                assert.equal(ctx.ApplicantsTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
                assert.equal(ctx.DeceasedTask.status, 'complete');
                assert.equal(ctx.ApplicantsTask.status, 'complete');
                assert.equal(ctx.ApplicantsTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
                assert.equal(ctx.ReviewAndConfirmTask.status, 'notStarted');
                assert.equal(ctx.ReviewAndConfirmTask.nextURL, steps[journeyMap.taskList().ReviewAndConfirmTask.firstStep].constructor.getUrl());
            });

            it('Updates the context: Review and confirm complete (Single Applicants)', () => {
                req.session.form = {
                    caseType: caseTypes.INTESTACY,
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
                req.session.form.caseType = caseTypes.INTESTACY;
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
                    payment: {
                        reference: '1234'
                    },
                    ccdCase: {
                        state: 'PAAppCreated',
                        id: 1535395401245028
                    }
                };
                req.body = {};
                ctx = taskList.getContextData(req);

                assert.equal(ctx.PaymentTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
                assert.equal(ctx.PaymentTask.status, 'started');
            });

            it('Updates the context: PaymentTask started (No Fee)', () => {
                req.session.form = {
                    payment: {
                        total: 0,
                    },
                    ccdCase: {
                        state: 'PAAppCreated',
                        id: 1535395401245028
                    }
                };
                req.body = {};
                ctx = taskList.getContextData(req);

                assert.equal(ctx.PaymentTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
                assert.equal(ctx.PaymentTask.status, 'started');
            });

            it('Updates the context: PaymentTask complete', () => {
                req.session.form = {
                    ccdCase: {
                        state: 'CasePrinted',
                        id: 1535395401245028
                    },
                    payment: {
                        status: 'Success',
                        reference: '1234'
                    }
                };
                req.body = {};
                ctx = taskList.getContextData(req);

                assert.equal(ctx.PaymentTask.checkYourAnswersLink, steps.Summary.constructor.getUrl());
                assert.equal(ctx.PaymentTask.status, 'complete');
            });

            it('Updates the context: DeceasedTask, Applicants, Review and confirm and Copies tasks complete', () => {
                req.session.form = completedForm;
                req.session.form.equality = {
                    pcqId: 'dummy_id'
                };
                req.body = {};
                ctx = taskList.getContextData(req);

                assert.equal(ctx.DeceasedTask.status, 'complete');
                assert.equal(ctx.ApplicantsTask.status, 'complete');
                assert.equal(ctx.ReviewAndConfirmTask.status, 'complete');
            });

            it('Test the Copies Previous Task Status is set correctly', () => {
                req.session.form = completedForm;
                ctx = taskList.getContextData(req);

                assert.equal(ctx.CopiesTask.status, 'complete');
            });
        });
    });

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                hasMultipleApplicants: true,
                alreadyDeclared: true,
                previousTaskStatus: 'complete',
                declarationStatuses: [
                    {
                        executorName: 'exec 1',
                        agreed: true
                    },
                    {
                        executorName: 'exec 2',
                        agreed: false
                    }
                ]
            };

            taskList.action(ctx);
            assert.isUndefined(ctx.hasMultipleApplicants);
            assert.isUndefined(ctx.alreadyDeclared);
            assert.isUndefined(ctx.previousTaskStatus);
            assert.isUndefined(ctx.declarationStatuses);
        });
    });
});
