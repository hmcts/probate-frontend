'use strict';

const initSteps = require('app/core/initSteps');
const assert = require('chai').assert;
const TestWrapper = require('test/util/TestWrapper');
const ExecutorNotified = require('app/steps/ui/executors/notified');
const Equality = require('app/steps/ui/equality');
const commonContent = require('app/resources/en/translation/common');
const caseTypes = require('app/utils/CaseTypes');
const config = require('config');

describe('executor-roles', () => {
    const expectedNextUrlForEquality = Equality.getUrl();
    const expectedNextUrlForExecNotified = ExecutorNotified.getUrl(1);
    const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
    const reasons = {
        optionPowerReserved: 'optionPowerReserved',
        optionRenunciated: 'optionRenunciated'
    };
    let testWrapper;
    let sessionData;

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorRoles');
        sessionData = {
            type: caseTypes.GOP,
            ccdCase: {
                state: 'Pending',
                id: 1234567890123456
            },
            applicant: {
                firstName: 'John',
                lastName: 'TheApplicant'
            },
            executors: {
                executorsNumber: 2,
                list: [
                    {firstName: 'John', lastName: 'TheApplicant', isApplying: 'optionYes', isApplicant: true},
                    {fullName: 'Mana Manah', isApplying: 'optionNo', isDead: false},
                    {fullName: 'Mee Mee', isApplying: 'optionNo', isDead: true},
                    {fullName: 'Boo Boo', isApplying: 'optionNo'}

                ]
            }
        };
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test help block content is loaded on page', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const playbackData = {
                        helpTitle: commonContent.helpTitle,
                        helpHeading1: commonContent.helpHeading1,
                        helpHeading2: commonContent.helpHeading2,
                        helpHeading3: commonContent.helpHeading3,
                        helpTelephoneNumber: commonContent.helpTelephoneNumber,
                        helpTelephoneOpeningHoursTitle: commonContent.helpTelephoneOpeningHoursTitle,
                        helpTelephoneOpeningHours1: commonContent.helpTelephoneOpeningHours1,
                        helpTelephoneOpeningHours2: commonContent.helpTelephoneOpeningHours2,
                        helpTelephoneOpeningHours3: commonContent.helpTelephoneOpeningHours3,
                        helpTelephoneOpeningHours4: commonContent.helpTelephoneOpeningHours4,
                        helpEmailLabel: commonContent.helpEmailLabel.replace(/{contactEmailAddress}/g, commonContent.helpEmail)
                    };

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test correct content is loaded on executor applying page', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        executorFullName: 'Mana Manah',
                        applicationFormPA15: config.links.applicationFormPA15
                    };

                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
                    testWrapper.testContent(done, contentData);
                });
        });

        it('test schema validation when executor is not applying', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const errorsToTest = ['notApplyingReason'];
                    const data = {
                        notApplyingReason: null
                    };

                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
                    testWrapper.testErrors(done, data, 'required', errorsToTest);
                });
        });

        it(`test it redirects to notified page: ${expectedNextUrlForExecNotified}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        notApplyingReason: 'optionPowerReserved'
                    };

                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
                    testWrapper.testRedirect(done, data, expectedNextUrlForExecNotified);
                });
        });

        it(`test it redirects to tasklist page: ${expectedNextUrlForEquality}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        notApplyingReason: 'optionRenunciated'
                    };

                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(2);
                    testWrapper.testRedirect(done, data, expectedNextUrlForEquality);
                });
        });
    });

    describe('handlePost', () => {
        it('Adds the keys to the context', () => {
            const ExecutorRoles = steps.ExecutorRoles;
            let ctx = {
                list: [
                    {
                        lastName: 'The',
                        firstName: 'Applicant',
                        isApplying: 'optionYes',
                        isApplicant: true
                    },
                    {
                        fullName: 'Another Executor',
                        isDead: false
                    }
                ],
                index: 1,
                isApplying: 'optionNo',
                notApplyingReason: reasons.optionRenunciated
            };

            [ctx] = ExecutorRoles.handlePost(ctx);
            assert.containsAllKeys(ctx.list[1], ['isApplying', 'notApplyingReason', 'notApplyingKey']);
        });

        it('Gets the reason key from the json and adds it to the context', () => {
            const ExecutorRoles = steps.ExecutorRoles;
            let ctx = {
                list: [
                    {
                        lastName: 'The',
                        firstName: 'Applicant',
                        isApplying: 'optionYes',
                        isApplicant: true
                    },
                    {
                        fullName: 'Another Executor',
                        isDead: false
                    }
                ],
                index: 1,
                isApplying: 'optionNo',
                notApplyingReason: reasons.optionRenunciated
            };

            Object.keys(reasons).forEach((key) => {
                ctx.notApplyingReason = reasons[key];
                [ctx] = ExecutorRoles.handlePost(ctx);
                assert.exists(ctx.list[1].notApplyingKey, 'key not found - this key is needed for CCD data');
                assert(ctx.list[1].notApplyingKey === key, `${ctx.list[1].notApplyingKey} is unrecognised`);
            });
        });
    });
});
