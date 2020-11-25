'use strict';

const TestWrapper = require('test/util/TestWrapper');
const TaskList = require('app/steps/ui/tasklist');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('executors-invites-sent', () => {
    let testWrapper;
    const expectedNextUrlForTaskList = TaskList.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorsInvitesSent');
    });

    afterEach(async () => {
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ExecutorsInvitesSent', null, null, [], false, {type: caseTypes.GOP, declaration: {declarationCheckbox: 'true'}});

        it('test content loaded on the page', (done) => {
            const sessionData = {
                type: caseTypes.GOP,
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                declaration: {
                    declarationCheckbox: 'true'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    try {
                        testWrapper.testContent(done);
                    } catch (e) {
                        console.error(e.message);
                        done(e);
                    }
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForTaskList}`, (done) => {
            try {
                testWrapper.testRedirect(done, {}, expectedNextUrlForTaskList);
            } catch (e) {
                console.error(e.message);
                done(e);
            }
        });
    });
});
