'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DivorcePlace = require('app/steps/ui/deceased/divorceplace/index');
const TaskList = require('app/steps/ui/tasklist/index');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');
const content = require('app/resources/en/translation/deceased/maritalstatus');
const config = require('app/config');
const nock = require('nock');
const featureToggleUrl = config.featureToggles.url;
const intestacyQuestionsFeatureTogglePath = `${config.featureToggles.path}/${config.featureToggles.intestacy_questions}`;
const featureTogglesNock = (status = 'true') => {
    nock(featureToggleUrl)
        .get(intestacyQuestionsFeatureTogglePath)
        .reply(200, status);
};

describe('deceased-marital-status', () => {
    let testWrapper;
    const expectedNextUrlForDivorcePlace = DivorcePlace.getUrl();
    const expectedNextUrlForTaskList = TaskList.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedMaritalStatus');
        featureTogglesNock();
    });

    afterEach(() => {
        testWrapper.destroy();
        nock.cleanAll();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('DeceasedMaritalStatus', featureTogglesNock);

        it('test content loaded on the page', (done) => {
            const sessionData = {
                deceased: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {deceasedName: 'John Doe'};
                    const excludeKeys = ['divorce', 'separation'];

                    testWrapper.testContent(done, excludeKeys, contentData);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required', []);
        });

        it(`test it redirects to divorce place page if divorced: ${expectedNextUrlForDivorcePlace}`, (done) => {
            testWrapper.agent.post('/prepare-session-field/willLeft/No')
                .end(() => {
                    const data = {
                        maritalStatus: content.optionDivorced
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForDivorcePlace);
                });
        });

        it(`test it redirects to divorce place page if separated: ${expectedNextUrlForDivorcePlace}`, (done) => {
            testWrapper.agent.post('/prepare-session-field/willLeft/No')
                .end(() => {
                    const data = {
                        maritalStatus: content.optionSeparated
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForDivorcePlace);
                });
        });

        it(`test it redirects to tasklist if married: ${expectedNextUrlForTaskList}`, (done) => {
            testWrapper.agent.post('/prepare-session-field/willLeft/No')
                .end(() => {
                    const data = {
                        maritalStatus: content.optionMarried
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForTaskList);
                });
        });

        it(`test it redirects to tasklist if not married: ${expectedNextUrlForTaskList}`, (done) => {
            testWrapper.agent.post('/prepare-session-field/willLeft/No')
                .end(() => {
                    const data = {
                        maritalStatus: content.optionNotMarried
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForTaskList);
                });
        });

        it(`test it redirects to tasklist if widowed: ${expectedNextUrlForTaskList}`, (done) => {
            testWrapper.agent.post('/prepare-session-field/willLeft/No')
                .end(() => {
                    const data = {
                        maritalStatus: content.optionWidowed
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForTaskList);
                });
        });
    });
});
