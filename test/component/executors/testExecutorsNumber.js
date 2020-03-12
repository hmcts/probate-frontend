'use strict';

const TestWrapper = require('test/util/TestWrapper');
const TaskList = require('app/steps/ui/tasklist');
const ExecutorsNames = require('app/steps/ui/executors/names');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('executors-number', () => {
    let testWrapper;
    const expectedNextUrlForExecNames = ExecutorsNames.getUrl();
    const expectedNextUrlForTaskList = TaskList.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorsNumber');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ExecutorsNumber', null, null, [], false, {type: caseTypes.GOP});

        it('test content loaded on the page', (done) => {
            const sessionData = {
                type: caseTypes.GOP,
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done);
                });
        });

        it('test errors message displayed for invalid data', (done) => {
            const data = {executorsNumber: 'abd'};

            testWrapper.testErrors(done, data, 'invalid');
        });

        it('test errors message displayed for invalid data - negative numbers', (done) => {
            const data = {executorsNumber: '-1'};

            testWrapper.testErrors(done, data, 'invalid');
        });

        it('test errors message displayed for no number entered', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it('test it displays the errors when there are more than 20 executors', (done) => {
            const data = {executorsNumber: 21};

            testWrapper.testErrors(done, data, 'invalid');
        });

        it(`test it redirects to next page: ${expectedNextUrlForExecNames}`, (done) => {
            const data = {executorsNumber: 2};

            testWrapper.testRedirect(done, data, expectedNextUrlForExecNames);
        });

        it(`test it redirects to next page when there is only one executor: ${expectedNextUrlForTaskList}`, (done) => {
            const data = {executorsNumber: 1};

            testWrapper.testRedirect(done, data, expectedNextUrlForTaskList);
        });
    });
});
