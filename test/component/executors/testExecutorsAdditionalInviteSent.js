'use strict';

const TestWrapper = require('test/util/TestWrapper');
const TaskList = require('app/steps/ui/tasklist');

describe('executors-additional-invite-sent', () => {
    let testWrapper;
    let sessionData;
    const expectedNextUrlForTaskList = TaskList.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorsAdditionalInviteSent');
        sessionData = require('test/data/executors-invites');
    });

    afterEach(() => {
        testWrapper.destroy();
        delete require.cache[require.resolve('test/data/executors-invites')];
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test correct content loaded on the page when only 1 other executor added', (done) => {
            const contentToExclude = ['title-multiple', 'header-multiple'];
            sessionData.executors.executorsToNotifyList = [
                {fullName: 'Other Applicant', isApplying: true, emailSent: false},
            ];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, {}, contentToExclude);
                });
        });

        it('test correct content loaded on the page when more than 1 other executor added', (done) => {
            const contentToExclude = ['title', 'header'];
            sessionData.executors.executorsToNotifyList = [
                {fullName: 'Other Applicant', isApplying: true, emailSent: false},
                {fullName: 'Harvey', isApplying: true, emailSent: false}
            ];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, {}, contentToExclude);
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForTaskList}`, (done) => {
            sessionData.executors.executorsToNotifyList = [
                {fullName: 'Other Applicant', isApplying: true, emailSent: false},
            ];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testRedirect(done, {}, expectedNextUrlForTaskList);
                });
        });
    });
});
