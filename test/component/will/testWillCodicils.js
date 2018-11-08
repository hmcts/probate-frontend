'use strict';

const TestWrapper = require('test/util/TestWrapper');
const TaskList = require('app/steps/ui/tasklist/index');
const CodicilsNumber = require('app/steps/ui/will/codicilsnumber/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

describe('will-codicils', () => {
    let testWrapper;
    const expectedNextUrlForTasklist = TaskList.getUrl();
    const expectedNextUrlForCodicilsNumber = CodicilsNumber.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('WillCodicils');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        testHelpBlockContent.runTest('WillLeft');

        it('test correct content loaded on the page', (done) => {
            const excludeKeys = [];

            testWrapper.testContent(done, excludeKeys);
        });

        it('test errors message displayed for missing data', (done) => {
            const data = {};

            testWrapper.testErrors(done, data, 'required', []);
        });

        it(`test it redirects to tasklist page: ${expectedNextUrlForTasklist}`, (done) => {
            const sessionData = {};
            sessionData.featureToggles = {
                screening_questions: true
            };
            const data = {
                'codicils': 'No'
            };
            testWrapper.agent.post('/prepare-session/featureToggles')
                .send(sessionData.featureToggles)
                .end(() => {
                    testWrapper.testRedirect(done, data, expectedNextUrlForTasklist);
                });
        });

        it(`test it redirects to codicils number page: ${expectedNextUrlForCodicilsNumber}`, (done) => {
            const data = {
                'codicils': 'Yes'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForCodicilsNumber);
        });
    });
});
