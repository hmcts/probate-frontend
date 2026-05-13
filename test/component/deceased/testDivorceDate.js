'use strict';

const TestWrapper = require('test/util/TestWrapper');
const TaskList = require('app/steps/ui/tasklist');
const testCommonContent = require('test/component/common/testCommonContent.js');
const contentMaritalStatus = require('app/resources/en/translation/deceased/maritalstatus');
const caseTypes = require('app/utils/CaseTypes');

describe('divorce-date', () => {
    let testWrapper;
    const expectedNextUrlForTaskList = TaskList.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DivorceDate');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('DivorceDate', null, null, [], false, {type: caseTypes.INTESTACY});

        it('test correct content loaded on the page for divorced', (done) => {
            const sessionData = {
                type: caseTypes.INTESTACY,
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                deceased: {
                    firstName: 'John',
                    lastName: 'Doe',
                    maritalStatus: 'optionDivorced',
                    divorceDateKnown: 'optionYes'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentToExclude = ['separatedParagraph1', 'separatedParagraph2'];
                    const data = {deceasedName: 'John Doe', legalProcess: contentMaritalStatus.divorce, legalProcessDifferentText: contentMaritalStatus.divorced};
                    testWrapper.testContent(done, data, contentToExclude);
                });
        });

        it('test correct content loaded on the page for separated', (done) => {
            const sessionData = {
                type: caseTypes.INTESTACY,
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                deceased: {
                    firstName: 'John',
                    lastName: 'Doe',
                    maritalStatus: 'optionSeparated',
                    divorceDateKnown: 'optionYes'
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentToExclude = ['divorcedParagraph1', 'divorcedParagraph2'];
                    const data = {deceasedName: 'John Doe', legalProcess: contentMaritalStatus.separation, legalProcessDifferentText: contentMaritalStatus.separation};
                    testWrapper.testContent(done, data, contentToExclude);
                });
        });

        it(`test it redirects to tasklist page: ${expectedNextUrlForTaskList}`, (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({caseType: caseTypes.INTESTACY})
                .end(() => {
                    const data = {
                        maritalStatus: 'optionDivorced',
                        divorceDateKnown: 'optionNo'
                    };

                    testWrapper.testRedirect(done, data, expectedNextUrlForTaskList);
                });
        });
    });
});
