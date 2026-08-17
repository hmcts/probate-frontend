'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedNameAsOnWill = require('app/steps/ui/deceased/nameasonwill');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('deceased-name', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedNameAsOnWill = DeceasedNameAsOnWill.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedName');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('DeceasedName', null, null, [], false, {type: caseTypes.GOP});

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

        it(`test it redirects to Deceased Name As On Will page: ${expectedNextUrlForDeceasedNameAsOnWill}`, (done) => {
            const data = {
                firstName: 'Bob',
                lastName: 'Smith'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedNameAsOnWill);
        });
    });
});
