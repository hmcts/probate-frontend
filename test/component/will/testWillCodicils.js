'use strict';

const TestWrapper = require('test/util/TestWrapper');
const TaskList = require('app/steps/ui/tasklist');
const CodicilsNumber = require('app/steps/ui/will/codicilsnumber');
const testCommonContent = require('test/component/common/testCommonContent.js');

describe('will-codicils', () => {
    let testWrapper;
    const expectedNextUrlForTaskList = TaskList.getUrl();
    const expectedNextUrlForCodicilsNumber = CodicilsNumber.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('WillCodicils');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('WillCodicils');

        it('test correct content loaded on the page', (done) => {
            testWrapper.testContent(done);
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to TaskList page: ${expectedNextUrlForTaskList}`, (done) => {
            const data = {
                codicils: 'No'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForTaskList);
        });

        it(`test it redirects to Codicils Number page: ${expectedNextUrlForCodicilsNumber}`, (done) => {
            const data = {
                codicils: 'Yes'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForCodicilsNumber);
        });
    });
});
