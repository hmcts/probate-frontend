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

    afterEach(async () => {
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test correct content loaded on the copies summary page, when no data is entered', (done) => {
            const sessionData = {
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
                    const contentData = {
                        ukQuestion: copiesContent.uk.question,
                        overseasAssetsQuestion: assetsContent.overseas.question
                    };

                    testWrapper.testContent(done, contentData);
                });
        });

        it('test correct content loaded on the copies summary page, when section is completed', (done) => {
            const sessionData = require('test/data/complete-form-undeclared').formdata;
            sessionData.declaration = {
                declarationCheckbox: 'true'
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    const contentData = {
                        ukQuestion: copiesContent.uk.question,
                        overseasAssetsQuestion: assetsContent.overseas.question,
                        overseasCopiesQuestion: copiesContent.overseas.question
                    };

                    delete require.cache[require.resolve('test/data/complete-form-undeclared')];
                    testWrapper.testContent(done, contentData);
                });
        });

        it(`test it redirects to Tasklist: ${expectedNextUrlForTaskList}`, (done) => {
            testWrapper.testRedirect(done, {}, expectedNextUrlForTaskList);
        });
    });
});
