'use strict';

const TestWrapper = require('test/util/TestWrapper');
const ExecutorsNames = require('app/steps/ui/executors/names');
const Equality = require('app/steps/ui/equality');
const testCommonContent = require('test/component/common/testCommonContent');
const caseTypes = require('app/utils/CaseTypes');

describe('executors-named', () => {
    let testWrapper, sessionData;
    const expectedNextUrlForExecNames = ExecutorsNames.getUrl();
    const expectedNextUrlForEquality = Equality.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('ExecutorsNamed');
        sessionData = {
            type: caseTypes.GOP,
            ccdCase: {
                state: 'Pending',
                id: 1234567890123456
            },
            applicant: {
                'firstName': 'Bobby',
                'lastName': 'Applicant',
                'nameAsOnTheWill': 'optionYes',
                'isApplying': true,
                'isApplicant': true,
                'fullName': 'Bobby Applicant'
            },
            executors: {
                executorsNumber: 2,
                list: [
                    {
                        'fullName': 'Fred Exec One',
                        'isApplying': false
                    },
                    {
                        'fullName': 'Jeff Exec Two',
                        'isApplying': false
                    }
                ]
            }
        };
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('ExecutorsNamed', null, null, [], false, {type: caseTypes.GOP});

        it('test redirection to names page when selecting yes with multiple executors', (done) => {
            const data = {executorsNamed: 'optionYes', executorsNamedChecked: 'true'};
            testWrapper.testRedirect(done, data, expectedNextUrlForExecNames);
        });

        it('test redirection to equality page when selecting no', (done) => {
            const data = {list: [{
                'fullName': 'Jeff Exec Two',
                'isApplying': false
            }],
            executorsNamed: 'optionNo',
            executorsNamedChecked: 'true'};
            testWrapper.testRedirect(done, data, expectedNextUrlForEquality);
        });

        it('test correct content loaded on the page when lead applicant does not have an alias', (done) => {
            const contentToExclude = ['titleWithCodicil', 'hintTextWithCodicil'];
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, {}, contentToExclude);
                });
        });

        it('test correct content loaded on the page when lead applicant does have an alias', (done) => {
            const contentToExclude = ['titleWithCodicil', 'hintTextWithCodicil'];
            sessionData.executors.list[0].fullName = 'Fred Exec One';
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, {}, contentToExclude);
                });
        });

        it('test errors message displayed for required data', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {executorsNamedChecked: 'false'};
                    testWrapper.testErrors(done, data, 'required');
                });
        });
    });
});
