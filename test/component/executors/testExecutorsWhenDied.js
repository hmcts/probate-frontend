// eslint-disable-line max-lines

'use strict';

const initSteps = require('app/core/initSteps');
const assert = require('chai').assert;
const TestWrapper = require('test/util/TestWrapper');
const ExecutorsWhenDied = require('app/steps/ui/executors/whendied');
const Equality = require('app/steps/ui/equality');
const ExecutorsApplying = require('app/steps/ui/executors/applying');
const contentData = {executorFullName: 'many clouds'};
const commonContent = require('app/resources/en/translation/common');
const caseTypes = require('app/utils/CaseTypes');

describe('executors-when-died', () => {
    let testWrapper, sessionData;
    const expectedNextUrlForExecsWhenDied = ExecutorsWhenDied.getUrl(2);
    const expectedNextUrlForEquality = Equality.getUrl();
    const expectedNextUrlForExecsApplying = ExecutorsApplying.getUrl(2);
    const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
    const reasons = {
        optionDiedBefore: 'optionDiedBefore',
        optionDiedAfter: 'optionDiedAfter'
    };
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
                isDead: true
            }
        ],
        index: 1,
        isApplying: 'optionNo',
        notApplyingReason: reasons.optionDiedBefore,
        diedbefore: 'optionYes'
    };

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorsWhenDied');
        sessionData = {
            type: caseTypes.GOP,
            ccdCase: {
                state: 'Pending',
                id: 1234567890123456
            },
            index: 1,
            applicant: {
                firstName: 'John',
                lastName: 'TheApplicant'
            },
            executors: {
                executorsNumber: 3,
                list: [
                    {firstName: 'John', lastName: 'TheApplicant', isApplying: 'optionYes', isApplicant: true},
                    {fullName: 'many clouds', isDead: true},
                    {fullName: 'harvey smith', isDead: false}
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
                        helpEmailLabel: commonContent.helpEmailLabel.replace(/{contactEmailAddress}/g, commonContent.helpEmail)
                    };

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test content loaded on the page', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                    };
                    testWrapper.testErrors(done, data, 'required');
                });
        });

        it(`test it redirects to execs when died page when yes selected: ${expectedNextUrlForExecsWhenDied}`, (done) => {
            sessionData = {
                index: 1,
                applicant: {
                    firstName: 'John',
                    lastName: 'TheApplicant'
                },
                executors: {
                    executorsNumber: 3,
                    list: [
                        {firstName: 'John', lastName: 'TheApplicant', isApplying: 'optionYes', isApplicant: true},
                        {fullName: 'Many Clouds', isDead: true},
                        {fullName: 'Bob Too', isDead: true}
                    ]
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        diedbefore: 'optionYes'
                    };
                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
                    testWrapper.testRedirect(done, data, expectedNextUrlForExecsWhenDied);
                });
        });

        it(`test it redirects to execs when died page when no selected: ${expectedNextUrlForExecsWhenDied}`, (done) => {
            sessionData = {
                index: 1,
                applicant: {
                    firstName: 'John',
                    lastName: 'TheApplicant'
                },
                executors: {
                    executorsNumber: 3,
                    list: [
                        {firstName: 'John', lastName: 'TheApplicant', isApplying: 'optionYes', isApplicant: true},
                        {fullName: 'Many Clouds', isDead: true},
                        {fullName: 'Bob Too', isDead: true}
                    ]
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        diedbefore: 'optionNo'
                    };
                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
                    testWrapper.testRedirect(done, data, expectedNextUrlForExecsWhenDied);
                });
        });

        it(`test it redirects to dealing with estate page when yes selected: ${expectedNextUrlForExecsApplying}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        diedbefore: 'optionYes'
                    };
                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
                    testWrapper.testRedirect(done, data, expectedNextUrlForExecsApplying);
                });
        });

        it(`test it redirects to dealing with estate page when no selected: ${expectedNextUrlForExecsApplying}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        diedbefore: 'optionNo'
                    };
                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
                    testWrapper.testRedirect(done, data, expectedNextUrlForExecsApplying);
                });
        });

        it(`test it redirects to tasklist page when yes selected: ${expectedNextUrlForEquality}`, (done) => {
            sessionData = {
                index: 1,
                applicant: {
                    firstName: 'John',
                    lastName: 'TheApplicant'
                },
                executors: {
                    executorsNumber: 3,
                    list: [
                        {firstName: 'John', lastName: 'TheApplicant', isApplying: 'optionYes', isApplicant: true},
                        {fullName: 'Many Clouds', isDead: true},
                    ]
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        diedbefore: 'optionYes'
                    };
                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
                    testWrapper.testRedirect(done, data, expectedNextUrlForEquality);
                });
        });

        it(`test it redirects to tasklist page when no selected: ${expectedNextUrlForEquality}`, (done) => {
            sessionData = {
                index: 1,
                applicant: {
                    firstName: 'John',
                    lastName: 'TheApplicant'
                },
                executors: {
                    executorsNumber: 3,
                    list: [
                        {firstName: 'John', lastName: 'TheApplicant', isApplying: 'optionYes', isApplicant: true},
                        {fullName: 'Many Clouds', isDead: true},
                    ]
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        diedbefore: 'optionNo'
                    };
                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
                    testWrapper.testRedirect(done, data, expectedNextUrlForEquality);
                });
        });

        it(`test it redirects to tasklist page when yes selected on last exec: ${expectedNextUrlForEquality}`, (done) => {
            sessionData = {
                index: 1,
                applicant: {
                    firstName: 'John',
                    lastName: 'TheApplicant'
                },
                executors: {
                    executorsNumber: 3,
                    list: [
                        {firstName: 'John', lastName: 'TheApplicant', isApplying: 'optionYes', isApplicant: true},
                        {fullName: 'Many Clouds', isDead: true},
                        {fullName: 'Bob Too', isDead: true}
                    ]
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        diedbefore: 'optionYes'
                    };
                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(2);
                    testWrapper.testRedirect(done, data, expectedNextUrlForEquality);
                });
        });

        it(`test it redirects to tasklist page when no selected on last exec: ${expectedNextUrlForEquality}`, (done) => {
            sessionData = {
                index: 1,
                applicant: {
                    firstName: 'John',
                    lastName: 'TheApplicant'
                },
                executors: {
                    executorsNumber: 3,
                    list: [
                        {firstName: 'John', lastName: 'TheApplicant', isApplying: 'optionYes', isApplicant: true},
                        {fullName: 'Many Clouds', isDead: true},
                        {fullName: 'Bob Too', isDead: true}
                    ]
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        diedbefore: 'optionNo'
                    };
                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(2);
                    testWrapper.testRedirect(done, data, expectedNextUrlForEquality);
                });
        });
    });

    describe('handlePost', () => {
        it('Adds the keys to the context', () => {
            const ExecutorsWhenDied = steps.ExecutorsWhenDied;

            [ctx] = ExecutorsWhenDied.handlePost(ctx);
            assert.containsAllKeys(ctx.list[1], ['notApplyingReason', 'notApplyingKey']);
        });

        it('Gets the reason key from the json and adds it to the context', () => {
            const ExecutorsWhenDied = steps.ExecutorsWhenDied;

            Object.keys(reasons).forEach((key) => {
                ctx.notApplyingReason = reasons[key];
                ctx.diedbefore = 'optionNo';
                if (key === 'optionDiedBefore') {
                    ctx.diedbefore = 'optionYes';
                }
                ctx.index = 1;
                [ctx] = ExecutorsWhenDied.handlePost(ctx);
                assert.exists(ctx.list[1].notApplyingKey, 'key not found - This Key is needed for CCD data');
                assert(ctx.list[1].notApplyingKey === key, `${ctx.list[1].notApplyingKey} is unrecognised`);
            });
        });
    });
});
