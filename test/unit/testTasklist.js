/* eslint-disable max-lines */

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
const DateValidation = require('app/utils/DateValidation');
const sinon = require('sinon');

describe('Tasklist', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = taskList.getUrlWithContext({});
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
                    form: {
                        ccdCase: {
                            lastModifiedDate: '2020-01-01'
                        }
                    },
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

                assert.equal(ctx.DeceasedTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
                assert.equal(ctx.DeceasedTask.status, 'notStarted');
                assert.equal(ctx.DeceasedTask.nextURL, steps[journeyMap.taskList().DeceasedTask.firstStep].getUrlWithContext(ctx));
                assert.equal(ctx.ExecutorsTask.status, 'notStarted');
                assert.equal(ctx.ExecutorsTask.nextURL, steps[journeyMap.taskList().ExecutorsTask.firstStep].getUrlWithContext(ctx));
            });

            it('Updates the context: DeceasedTask started', () => {
                const formdata = {language: {bilingual: 'optionNo'}, deceased: {firstName: 'Test first name', lastName: 'Test last name'}};
                req.session.form = formdata;
                ctx = taskList.getContextData(req);
                ctx = Object.assign(ctx, formdata.deceased);

                assert.equal(ctx.DeceasedTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
                assert.equal(ctx.DeceasedTask.status, 'started');
                assert.equal(ctx.DeceasedTask.nextURL, journeyMap.nextStep(steps.DeceasedName, ctx).getUrlWithContext(ctx));
                assert.equal(ctx.ExecutorsTask.status, 'notStarted');
                assert.equal(ctx.ExecutorsTask.nextURL, steps[journeyMap.taskList().ExecutorsTask.firstStep].getUrlWithContext(ctx));
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

                assert.equal(ctx.DeceasedTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
                assert.equal(ctx.DeceasedTask.status, 'complete');
                assert.equal(ctx.ExecutorsTask.status, 'notStarted');
                assert.equal(ctx.ExecutorsTask.nextURL, steps[journeyMap.taskList().ExecutorsTask.firstStep].getUrlWithContext(ctx));
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

                assert.equal(ctx.ExecutorsTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
                assert.equal(ctx.DeceasedTask.status, 'complete');
                assert.equal(ctx.ExecutorsTask.status, 'started');
                assert.equal(ctx.ExecutorsTask.nextURL, journeyMap.nextStep(steps.ApplicantName, formdata.will).getUrlWithContext(ctx));
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

                assert.equal(ctx.DeceasedTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
                assert.equal(ctx.DeceasedTask.status, 'started');
                assert.equal(ctx.DeceasedTask.nextURL, journeyMap.nextStep(steps.DeceasedName, ctx).getUrlWithContext(ctx));
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

                assert.equal(ctx.ExecutorsTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
                assert.equal(ctx.DeceasedTask.status, 'complete');
                assert.equal(ctx.ExecutorsTask.status, 'complete');
                assert.equal(ctx.ExecutorsTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
                assert.equal(ctx.ReviewAndConfirmTask.status, 'notStarted');
                assert.equal(ctx.ReviewAndConfirmTask.nextURL, steps[journeyMap.taskList().ReviewAndConfirmTask.firstStep].getUrlWithContext(ctx));
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
                assert.equal(ctx.PaymentTask.status, 'notStarted');
                assert.equal(ctx.PaymentTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
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
                assert.equal(ctx.PaymentTask.status, 'notStarted');
                assert.equal(ctx.PaymentTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
            });

            it('Updates the context: Review and confirm complete (Multiple Applicants Not all have agreed)', () => {
                req.session.form = {
                    will: completedForm.will,
                    iht: completedForm.iht,
                    applicant: completedForm.applicant,
                    deceased: completedForm.deceased,
                    executors: completedForm.executors,
                    declaration: completedForm.declaration,
                    ccdCase: {
                        lastModifiedDate: '2020-01-01'
                    }
                };
                req.body = {};
                req.session.haveAllExecutorsDeclared = 'false';
                ctx = taskList.getContextData(req);

                assert.equal(ctx.ReviewAndConfirmTask.status, 'complete');
                assert.equal(ctx.previousTaskStatus.PaymentTask, 'locked');
            });

            it('Updates the context: PaymentTask not started', () => {
                req.session.form = {};
                req.body = {};
                ctx = taskList.getContextData(req);

                assert.equal(ctx.PaymentTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
                assert.equal(ctx.PaymentTask.status, 'notStarted');
            });

            it('Updates the context: PaymentTask started (Fee to Pay)', () => {
                req.session.form = {
                    payment: {
                        reference: '1234'
                    },
                    ccdCase: {
                        state: 'PAAppCreated',
                        id: 1535395401245028,
                        lastModifiedDate: '2020-01-01'
                    }
                };
                req.body = {};
                ctx = taskList.getContextData(req);

                assert.equal(ctx.PaymentTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
                assert.equal(ctx.PaymentTask.status, 'notStarted');
            });

            it('Updates the context: PaymentTask started (No Fee)', () => {
                req.session.form = {
                    copies: {
                        uk: 1
                    },
                    payment: {
                        total: 0,
                    },
                    ccdCase: {
                        state: 'PAAppCreated',
                        id: 1535395401245028,
                        lastModifiedDate: '2020-01-01'
                    }
                };
                req.body = {};
                ctx = taskList.getContextData(req);

                assert.equal(ctx.PaymentTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
                assert.equal(ctx.PaymentTask.status, 'started');
            });

            it('Updates the context: PaymentTask complete', () => {
                req.session.form = {
                    ccdCase: {
                        state: 'CasePrinted',
                        id: 1535395401245028,
                        lastModifiedDate: '2020-01-01'
                    },
                    assets: {
                        assetsoverseas: 'optionYes'
                    },
                    copies: {
                        uk: 1,
                        overseas: 0
                    },
                    payment: {
                        status: 'Success',
                        reference: '1234'
                    }
                };
                req.body = {};
                ctx = taskList.getContextData(req);

                assert.equal(ctx.PaymentTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
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

                assert.equal(ctx.DocumentsTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
                assert.equal(ctx.DeceasedTask.status, 'complete');
                assert.equal(ctx.ExecutorsTask.status, 'complete');
                assert.equal(ctx.ReviewAndConfirmTask.status, 'complete');
                assert.equal(ctx.DocumentsTask.status, 'complete');
            });
        });

        describe('Probate Journey - will condition FT = ON', () => {
            let ctx = {};
            const req = {
                session: {
                    form: {
                        ccdCase: {},
                    },
                },
                featureToggles: {'ft_will_condition': true},
                query: {}
            };

            beforeEach(() => {
                req.session.journey = journeyProbate;
                journeyMap = new JourneyMap(journeyProbate);
            });

            afterEach(() => {
                sinon.restore();
            });

            it('Updates the context: neither task is started', () => {
                ctx = taskList.getContextData(req);

                assert.equal(ctx.DeceasedTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
                assert.equal(ctx.DeceasedTask.status, 'notStarted');
                assert.equal(ctx.DeceasedTask.nextURL, steps[journeyMap.taskList().DeceasedTask.firstStep].getUrlWithContext(ctx));
                assert.equal(ctx.ExecutorsTask.status, 'notStarted');
                assert.equal(ctx.ExecutorsTask.nextURL, steps[journeyMap.taskList().ExecutorsTask.firstStep].getUrlWithContext(ctx));
            });

            it('Updates the context: DeceasedTask started', () => {
                const formdata = {language: {bilingual: 'optionNo'}, deceased: {firstName: 'Test first name', lastName: 'Test last name'}};
                req.session.form = formdata;
                ctx = taskList.getContextData(req);
                ctx = Object.assign(ctx, formdata.deceased);

                assert.equal(ctx.DeceasedTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
                assert.equal(ctx.DeceasedTask.status, 'started');
                assert.equal(ctx.DeceasedTask.nextURL, journeyMap.nextStep(steps.DeceasedName, ctx).getUrlWithContext(ctx));
                assert.equal(ctx.ExecutorsTask.status, 'notStarted');
                assert.equal(ctx.ExecutorsTask.nextURL, steps[journeyMap.taskList().ExecutorsTask.firstStep].getUrlWithContext(ctx));
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

                assert.equal(ctx.DeceasedTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
                assert.equal(ctx.DeceasedTask.status, 'complete');
                assert.equal(ctx.ExecutorsTask.status, 'notStarted');
                assert.equal(ctx.ExecutorsTask.nextURL, steps[journeyMap.taskList().ExecutorsTask.firstStep].getUrlWithContext(ctx));
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

                assert.equal(ctx.ExecutorsTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
                assert.equal(ctx.DeceasedTask.status, 'complete');
                assert.equal(ctx.ExecutorsTask.status, 'started');
                assert.equal(ctx.ExecutorsTask.nextURL, journeyMap.nextStep(steps.ApplicantName, formdata.will).getUrlWithContext(ctx));
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

                assert.equal(ctx.DeceasedTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
                assert.equal(ctx.DeceasedTask.status, 'started');
                assert.equal(ctx.DeceasedTask.nextURL, journeyMap.nextStep(steps.DeceasedName, ctx).getUrlWithContext(ctx));
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

                assert.equal(ctx.ExecutorsTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
                assert.equal(ctx.DeceasedTask.status, 'complete');
                assert.equal(ctx.ExecutorsTask.status, 'complete');
                assert.equal(ctx.ExecutorsTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
                assert.equal(ctx.ReviewAndConfirmTask.status, 'notStarted');
                assert.equal(ctx.ReviewAndConfirmTask.nextURL, steps[journeyMap.taskList().ReviewAndConfirmTask.firstStep].getUrlWithContext(ctx));
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
                assert.equal(ctx.PaymentTask.status, 'notStarted');
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
                assert.equal(ctx.PaymentTask.status, 'notStarted');
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
                assert.equal(ctx.previousTaskStatus.PaymentTask, 'locked');
            });

            it('Updates the context: PaymentTask not started', () => {
                req.session.form = {};
                req.body = {};
                ctx = taskList.getContextData(req);

                assert.equal(ctx.PaymentTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
                assert.equal(ctx.PaymentTask.status, 'notStarted');
            });

            it('Updates the context: PaymentTask started (Fee to Pay)', () => {
                req.session.form = {
                    assets: {
                        assetsoverseas: 'optionYes'
                    },
                    copies: {
                        uk: 1,
                        overseas: 0
                    },
                    payment: {
                        reference: '1234',
                        status: 'Initiated'
                    },
                    ccdCase: {
                        state: 'PAAppCreated',
                        id: 1535395401245028
                    }
                };
                req.body = {};
                ctx = taskList.getContextData(req);

                assert.equal(ctx.PaymentTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
                assert.equal(ctx.PaymentTask.status, 'started');
            });

            it('Updates the context: PaymentTask started (No Fee)', () => {
                req.session.form = {
                    copies: {
                        uk: 1
                    },
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

                assert.equal(ctx.PaymentTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
                assert.equal(ctx.PaymentTask.status, 'started');
            });

            it('Updates the context: PaymentTask complete', () => {
                req.session.form = {
                    ccdCase: {
                        state: 'CasePrinted',
                        id: 1535395401245028
                    },
                    assets: {
                        assetsoverseas: 'optionYes'
                    },
                    copies: {
                        uk: 1,
                        overseas: 1
                    },
                    payment: {
                        status: 'Success',
                        reference: '1234'
                    }
                };
                req.body = {};
                ctx = taskList.getContextData(req);

                assert.equal(ctx.PaymentTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
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

                assert.equal(ctx.DocumentsTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
                assert.equal(ctx.DeceasedTask.status, 'complete');
                assert.equal(ctx.ExecutorsTask.status, 'complete');
                assert.equal(ctx.ReviewAndConfirmTask.status, 'complete');
                assert.equal(ctx.DocumentsTask.status, 'complete');
            });

            it('Test the inactivity banner is set to display', () => {
                req.session.form = completedFormWillConditionOn;
                sinon.stub(DateValidation, 'daysToDelete').returns(0);
                ctx = taskList.getContextData(req);

                assert.equal(ctx.displayInactiveAlertBanner, true);
                assert.equal(ctx.daysToDeleteText, '0 day');
            });

            it('should return correct context data with inactive alert and days to delete', () => {
                sinon.stub(DateValidation, 'isInactivePeriod').returns(true);
                sinon.stub(DateValidation, 'daysToDelete').returns(45);

                const ctx = taskList.getContextData(req);

                expect(ctx.displayInactiveAlertBanner).to.equal(true);
                expect(ctx.daysToDeleteText).to.equal('45 days');
            });

            it('should format daysToDeleteText correctly for singular value (1 day)', () => {
                sinon.stub(DateValidation, 'isInactivePeriod').returns(false);
                sinon.stub(DateValidation, 'daysToDelete').returns(1);

                const ctx = taskList.getContextData(req);

                expect(ctx.displayInactiveAlertBanner).to.equal(false);
                expect(ctx.daysToDeleteText).to.equal('1 day');
            });

            it('should return default values when ccdCase is missing', () => {
                req.session.form = {ccdCase: null};

                sinon.stub(DateValidation, 'isInactivePeriod').returns(false);
                sinon.stub(DateValidation, 'daysToDelete').returns(0);

                const ctx = taskList.getContextData(req);

                expect(ctx.displayInactiveAlertBanner).to.equal(false);
                expect(ctx.daysToDeleteText).to.equal('0 day');
            });

            it('should return default values when formdata is missing', () => {
                req.session.form = {};

                sinon.stub(DateValidation, 'isInactivePeriod').returns(false);
                sinon.stub(DateValidation, 'daysToDelete').returns(0);

                const ctx = taskList.getContextData(req);

                expect(ctx.displayInactiveAlertBanner).to.equal(false);
                expect(ctx.daysToDeleteText).to.equal('0 day');
            });

            it('should handle null lastModifiedDate gracefully', () => {
                req.session.form = {ccdCase: {lastModifiedDate: null}};

                sinon.stub(DateValidation, 'isInactivePeriod').returns(false);
                sinon.stub(DateValidation, 'daysToDelete').returns(0);

                const ctx = taskList.getContextData(req);

                expect(ctx.displayInactiveAlertBanner).to.equal(false);
                expect(ctx.daysToDeleteText).to.equal('0 day');
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

                assert.equal(ctx.DeceasedTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
                assert.equal(ctx.DeceasedTask.status, 'notStarted');
                assert.equal(ctx.DeceasedTask.nextURL, steps[journeyMap.taskList().DeceasedTask.firstStep].getUrlWithContext(ctx));
                assert.equal(ctx.ApplicantsTask.status, 'notStarted');
                assert.equal(ctx.ApplicantsTask.nextURL, steps[journeyMap.taskList().ApplicantsTask.firstStep].getUrlWithContext(ctx));
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

                assert.equal(ctx.DeceasedTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
                assert.equal(ctx.DeceasedTask.status, 'started');
                assert.equal(ctx.DeceasedTask.nextURL, journeyMap.nextStep(steps.DeceasedDod, ctx).getUrlWithContext(ctx));
                assert.equal(ctx.ApplicantsTask.status, 'notStarted');
                assert.equal(ctx.ApplicantsTask.nextURL, steps[journeyMap.taskList().ApplicantsTask.firstStep].getUrlWithContext(ctx));
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

                assert.equal(ctx.DeceasedTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
                assert.equal(ctx.DeceasedTask.status, 'complete');
                assert.equal(ctx.ApplicantsTask.status, 'notStarted');
                assert.equal(ctx.ApplicantsTask.nextURL, steps[journeyMap.taskList().ApplicantsTask.firstStep].getUrlWithContext(ctx));
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

                assert.equal(ctx.ApplicantsTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
                assert.equal(ctx.DeceasedTask.status, 'complete');
                assert.equal(ctx.ApplicantsTask.status, 'started');
                assert.equal(ctx.ApplicantsTask.nextURL, journeyMap.nextStep(steps.RelationshipToDeceased, nextUrlCtx).getUrlWithContext(ctx));
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

                assert.equal(ctx.DeceasedTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
                assert.equal(ctx.DeceasedTask.status, 'started');
                assert.equal(ctx.DeceasedTask.nextURL, journeyMap.nextStep(steps.DeceasedDod, ctx).getUrlWithContext(ctx));
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

                assert.equal(ctx.ApplicantsTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
                assert.equal(ctx.DeceasedTask.status, 'complete');
                assert.equal(ctx.ApplicantsTask.status, 'complete');
                assert.equal(ctx.ApplicantsTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
                assert.equal(ctx.ReviewAndConfirmTask.status, 'notStarted');
                assert.equal(ctx.ReviewAndConfirmTask.nextURL, steps[journeyMap.taskList().ReviewAndConfirmTask.firstStep].getUrlWithContext(ctx));
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
                assert.equal(ctx.PaymentTask.status, 'notStarted');
                assert.equal(ctx.PaymentTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
            });

            it('Updates the context: PaymentTask not started', () => {
                req.session.form = {};
                req.body = {};
                ctx = taskList.getContextData(req);

                assert.equal(ctx.PaymentTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
                assert.equal(ctx.PaymentTask.status, 'notStarted');
            });

            it('Updates the context: PaymentTask started (Fee to Pay)', () => {
                req.session.form = {
                    payment: {
                        reference: '1234',
                        status: 'Initiated'
                    },
                    copies: {
                        uk: 1
                    },
                    ccdCase: {
                        state: 'PAAppCreated',
                        id: 1535395401245028
                    }
                };
                req.body = {};
                ctx = taskList.getContextData(req);

                assert.equal(ctx.PaymentTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
                assert.equal(ctx.PaymentTask.status, 'started');
            });

            it('Updates the context: PaymentTask started (No Fee)', () => {
                req.session.form = {
                    payment: {
                        total: 0,
                    },
                    copies: {
                        uk: 1
                    },
                    ccdCase: {
                        state: 'PAAppCreated',
                        id: 1535395401245028
                    }
                };
                req.body = {};
                ctx = taskList.getContextData(req);

                assert.equal(ctx.PaymentTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
                assert.equal(ctx.PaymentTask.status, 'started');
            });

            it('Updates the context: PaymentTask complete', () => {
                req.session.form = {
                    ccdCase: {
                        state: 'CasePrinted',
                        id: 1535395401245028
                    },
                    assets: {
                        assetsoverseas: 'optionNo'
                    },
                    copies: {
                        uk: 1
                    },
                    payment: {
                        status: 'Success',
                        reference: '1234'
                    }
                };
                req.body = {};
                ctx = taskList.getContextData(req);

                assert.equal(ctx.PaymentTask.checkYourAnswersLink, steps.Summary.getUrlWithContext(ctx));
                assert.equal(ctx.PaymentTask.status, 'complete');
            });

            it('Updates the context: DeceasedTask, Applicants, Review and confirm and Copies tasks complete', () => {
                req.session.form = completedForm;
                req.session.form.language = {bilingual: 'optionNo'};
                req.session.form.equality = {
                    pcqId: 'dummy_id'
                };
                req.body = {};
                ctx = taskList.getContextData(req);

                assert.equal(ctx.DeceasedTask.status, 'complete');
                assert.equal(ctx.ApplicantsTask.status, 'complete');
                assert.equal(ctx.ReviewAndConfirmTask.status, 'complete');
            });
        });
    });

    describe('handlePost()', () => {
        it('test it sets displaySuccessBanner', () => {
            const ctx = {
                isKeepDraft: 'true'
            };
            taskList.handlePost(ctx);
            assert.isTrue(ctx.displaySuccessBanner);
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
                ],
                displayInactiveAlertBanner: true,
                daysToDeleteText: '1 day',
                isKeepDraft: true
            };

            taskList.action(ctx);
            assert.isUndefined(ctx.hasMultipleApplicants);
            assert.isUndefined(ctx.alreadyDeclared);
            assert.isUndefined(ctx.previousTaskStatus);
            assert.isUndefined(ctx.declarationStatuses);
            assert.isUndefined(ctx.displayInactiveAlertBanner);
            assert.isUndefined(ctx.daysToDeleteText);
            assert.isUndefined(ctx.isKeepDraft);
        });
    });
});
