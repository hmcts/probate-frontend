'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DivorcePlace = require('app/steps/ui/deceased/divorceplace');
const TaskList = require('app/steps/ui/tasklist');
const testCommonContent = require('test/component/common/testCommonContent.js');
const content = require('app/resources/en/translation/deceased/maritalstatus');
const caseTypes = require('app/utils/CaseTypes');

describe('deceased-marital-status', () => {
    let testWrapper;
    const expectedNextUrlForDivorcePlace = DivorcePlace.getUrl();
    const expectedNextUrlForTaskList = TaskList.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedMaritalStatus');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('DeceasedMaritalStatus');

        it('test content loaded on the page', (done) => {
            const sessionData = {
                ccdCase: {
                    state: 'Draft',
                    id: 1234567890123456
                },
                deceased: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {deceasedName: 'John Doe'};
                    const contentToExclude = ['divorce', 'separation'];

                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to divorce place page if divorced: ${expectedNextUrlForDivorcePlace}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        maritalStatus: content.optionDivorced
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForDivorcePlace);
                });
        });

        it(`test it redirects to divorce place page if separated: ${expectedNextUrlForDivorcePlace}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        maritalStatus: content.optionSeparated
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForDivorcePlace);
                });
        });

        it(`test it redirects to tasklist if married: ${expectedNextUrlForTaskList}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        maritalStatus: content.optionMarried
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForTaskList);
                });
        });

        it(`test it redirects to tasklist if not married: ${expectedNextUrlForTaskList}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        maritalStatus: content.optionNotMarried
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForTaskList);
                });
        });

        it(`test it redirects to tasklist if widowed: ${expectedNextUrlForTaskList}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        maritalStatus: content.optionWidowed
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForTaskList);
                });
        });
    });
});
