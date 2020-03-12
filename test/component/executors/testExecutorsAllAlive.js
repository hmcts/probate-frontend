'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ExecutorsApplying = require('app/steps/ui/executors/applying');
const ExecutorsWhoDied = require('app/steps/ui/executors/whodied');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('executors-all-alive', () => {
    let testWrapper;
    const expectedNextUrlForExecsApplying = ExecutorsApplying.getUrl(1);
    const expectedNextUrlForExecsWhoDied = ExecutorsWhoDied.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorsAllAlive');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ExecutorsAllAlive', null, null, [], false, {type: caseTypes.GOP});

        it('test right content loaded on the page', (done) => {
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

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to executors applying: ${expectedNextUrlForExecsApplying}`, (done) => {
            const data = {
                allalive: 'optionYes'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForExecsApplying);
        });

        it(`test it redirects to which executors died: ${expectedNextUrlForExecsWhoDied}`, (done) => {
            const data = {
                allalive: 'optionNo'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForExecsWhoDied);
        });
    });
});
