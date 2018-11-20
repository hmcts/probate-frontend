// eslint-disable-line max-lines
'use strict';

const initSteps = require('app/core/initSteps');
const assert = require('chai').assert;
const TestWrapper = require('test/util/TestWrapper');
const ExecutorsWhenDied = require('app/steps/ui/executors/whendied/index');
const DeceasedName = require('app/steps/ui/deceased/name/index');
const ExecutorsApplying = require('app/steps/ui/executors/applying/index');
const contentData = {executorFullName: 'many clouds'};
const commonContent = require('app/resources/en/translation/common');
const config = require('app/config');

describe('executors-when-died', () => {
    let testWrapper, sessionData;
    const expectedNextUrlForExecsWhenDied = ExecutorsWhenDied.getUrl(2);
    const expectedNextUrlForDeceasedName = DeceasedName.getUrl();
    const expectedNextUrlForExecsApplying = ExecutorsApplying.getUrl(2);
    const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
    const reasons = {
        optionDiedBefore: 'This executor died (before the person who has died)',
        optionDiedAfter: 'This executor died (after the person who has died)'
    };
    let ctx = {
        list: [
            {
                lastName: 'The',
                firstName: 'Applicant',
                isApplying: 'Yes',
                isApplicant: true
            },
            {
                fullName: 'Another Executor',
                isDead: true
            }
        ],
        index: 1,
        isApplying: 'No',
        notApplyingReason: reasons.optionDiedBefore,
        diedbefore: 'Yes'
    };

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorsWhenDied');
        sessionData = {
            index: 1,
            applicant: {
                firstName: 'John',
                lastName: 'TheApplicant'
            },
            executors: {
                executorsNumber: 3,
                list: [
                    {firstName: 'John', lastName: 'TheApplicant', isApplying: 'Yes', isApplicant: true},
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
                    const playbackData = {};
                    playbackData.helpTitle = commonContent.helpTitle;
                    playbackData.helpText = commonContent.helpText;
                    playbackData.contactTelLabel = commonContent.contactTelLabel.replace('{helpLineNumber}', config.helpline.number);
                    playbackData.contactOpeningTimes = commonContent.contactOpeningTimes.replace('{openingTimes}', config.helpline.hours);
                    playbackData.helpEmailLabel = commonContent.helpEmailLabel;
                    playbackData.contactEmailAddress = commonContent.contactEmailAddress;

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test content loaded on the page', (done) => {
            testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, [], contentData);
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
                        {firstName: 'John', lastName: 'TheApplicant', isApplying: 'Yes', isApplicant: true},
                        {fullName: 'Many Clouds', isDead: true},
                        {fullName: 'Bob Too', isDead: true}
                    ]
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        diedbefore: 'Yes'
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
                        {firstName: 'John', lastName: 'TheApplicant', isApplying: 'Yes', isApplicant: true},
                        {fullName: 'Many Clouds', isDead: true},
                        {fullName: 'Bob Too', isDead: true}
                    ]
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        diedbefore: 'No'
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
                        diedbefore: 'Yes'
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
                        diedbefore: 'No'
                    };
                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
                    testWrapper.testRedirect(done, data, expectedNextUrlForExecsApplying);
                });
        });

        it(`test it redirects to deceased name page when yes selected: ${expectedNextUrlForDeceasedName}`, (done) => {
            sessionData = {
                index: 1,
                applicant: {
                    firstName: 'John',
                    lastName: 'TheApplicant'
                },
                executors: {
                    executorsNumber: 3,
                    list: [
                        {firstName: 'John', lastName: 'TheApplicant', isApplying: 'Yes', isApplicant: true},
                        {fullName: 'Many Clouds', isDead: true},
                    ]
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        diedbefore: 'Yes'
                    };
                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
                    testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedName);
                });
        });

        it(`test it redirects to deceased name page when no selected: ${expectedNextUrlForDeceasedName}`, (done) => {
            sessionData = {
                index: 1,
                applicant: {
                    firstName: 'John',
                    lastName: 'TheApplicant'
                },
                executors: {
                    executorsNumber: 3,
                    list: [
                        {firstName: 'John', lastName: 'TheApplicant', isApplying: 'Yes', isApplicant: true},
                        {fullName: 'Many Clouds', isDead: true},
                    ]
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        diedbefore: 'No'
                    };
                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(1);
                    testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedName);
                });
        });

        it(`test it redirects to deceased name page when yes selected on last exec: ${expectedNextUrlForDeceasedName}`, (done) => {
            sessionData = {
                index: 1,
                applicant: {
                    firstName: 'John',
                    lastName: 'TheApplicant'
                },
                executors: {
                    executorsNumber: 3,
                    list: [
                        {firstName: 'John', lastName: 'TheApplicant', isApplying: 'Yes', isApplicant: true},
                        {fullName: 'Many Clouds', isDead: true},
                        {fullName: 'Bob Too', isDead: true}
                    ]
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        diedbefore: 'Yes'
                    };
                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(2);
                    testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedName);
                });
        });

        it(`test it redirects to deceased name page when no selected on last exec: ${expectedNextUrlForDeceasedName}`, (done) => {
            sessionData = {
                index: 1,
                applicant: {
                    firstName: 'John',
                    lastName: 'TheApplicant'
                },
                executors: {
                    executorsNumber: 3,
                    list: [
                        {firstName: 'John', lastName: 'TheApplicant', isApplying: 'Yes', isApplicant: true},
                        {fullName: 'Many Clouds', isDead: true},
                        {fullName: 'Bob Too', isDead: true}
                    ]
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        diedbefore: 'No'
                    };
                    testWrapper.pageUrl = testWrapper.pageToTest.constructor.getUrl(2);
                    testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedName);
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

            Object.keys(reasons).forEach(key => {
                ctx.notApplyingReason = reasons[key];
                ctx.diedbefore = 'No';
                if (key === 'optionDiedBefore') {
                    ctx.diedbefore = 'Yes';
                }
                ctx.index = 1;
                [ctx] = ExecutorsWhenDied.handlePost(ctx);
                assert.exists(ctx.list[1].notApplyingKey, 'key not found - This Key is needed for CCD data');
                assert(ctx.list[1].notApplyingKey === key, `${ctx.list[1].notApplyingKey} is unrecognised`);
            });
        });
    });
});
