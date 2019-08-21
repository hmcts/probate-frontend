'use strict';

const TestWrapper = require('test/util/TestWrapper');
const requireDir = require('require-directory');
const TaskList = require('app/steps/ui/tasklist');
const copiesContent = requireDir(module, '../../../app/resources/en/translation/copies');
const assetsContent = requireDir(module, '../../../app/resources/en/translation/assets');

describe('copies-summary', () => {
    let testWrapper;
    const expectedNextUrlForTaskList = TaskList.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('CopiesSummary');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test correct content loaded on the copies summary page, when no data is entered', (done) => {
            const contentToExclude = [];
            const contentData = {};
            contentData.ukQuestion = copiesContent.uk.question;
            contentData.overseasAssetsQuestion = assetsContent.overseas.question;

            testWrapper.testContent(done, contentToExclude, contentData);
        });

        it('test correct content loaded on the copies summary page, when section is completed', (done) => {
            const sessionData = require('test/data/complete-form-undeclared').formdata;
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    const contentToExclude = [];
                    const contentData = {};
                    contentData.ukQuestion = copiesContent.uk.question;
                    contentData.overseasAssetsQuestion = assetsContent.overseas.question;
                    contentData.overseasCopiesQuestion = copiesContent.overseas.question;

                    delete require.cache[require.resolve('test/data/complete-form-undeclared')];
                    testWrapper.testContent(done, contentToExclude, contentData);
                });
        });

        it(`test it redirects to Tasklist: ${expectedNextUrlForTaskList}`, (done) => {
            const data = {};
            testWrapper.testRedirect(done, data, expectedNextUrlForTaskList);
        });

    });
});
