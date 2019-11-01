'use strict';

const TestWrapper = require('test/util/TestWrapper');
const TaskList = require('app/steps/ui/tasklist');
const testCommonContent = require('test/component/common/testCommonContent.js');

describe('codicils-number', () => {
    let testWrapper;
    const expectedNextUrlForTaskList = TaskList.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('CodicilsNumber');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('CodicilsNumber');

        it('test content loaded on the page', (done) => {
            const sessionData = {
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
            const data = {codicilsNumber: 'abd'};

            testWrapper.testErrors(done, data, 'invalid');
        });

        it('test errors message displayed for invalid data - negative numbers', (done) => {
            const data = {codicilsNumber: '-1'};

            testWrapper.testErrors(done, data, 'invalid');
        });

        it('test errors message displayed for no number entered', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to TaskList page: ${expectedNextUrlForTaskList}`, (done) => {
            const data = {codicilsNumber: '1'};

            testWrapper.testRedirect(done, data, expectedNextUrlForTaskList);
        });
    });
});
