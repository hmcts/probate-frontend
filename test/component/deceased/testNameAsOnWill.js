'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedDob = require('app/steps/ui/deceased/dob');
const DeceasedAliasNameOnWill = require('app/steps/ui/deceased/aliasnameonwill');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('../../../app/utils/CaseTypes');

describe('deceased-name-as-on-will', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedDob = DeceasedDob.getUrl();
    const expectedNextUrlForDeceasedAliasNameOnWill = DeceasedAliasNameOnWill.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedNameAsOnWill');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('DeceasedNameAsOnWill', null, null, [], false, {type: caseTypes.GOP});

        it('test right content loaded on the page', (done) => {
            const sessionData = {
                type: caseTypes.GOP,
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                deceased: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            };
            const contentToExclude = ['theDeceased', 'questionWithoutName'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {deceasedName: 'John Doe'};

                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test alias schema validation when no data is entered', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to Deceased DoB page: ${expectedNextUrlForDeceasedDob}`, (done) => {
            const data = {
                nameAsOnTheWill: 'optionYes',
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedDob);
        });

        it(`test it redirects to Deceased Alias Name on Will page: ${expectedNextUrlForDeceasedAliasNameOnWill}`, (done) => {
            const data = {
                nameAsOnTheWill: 'optionNo'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedAliasNameOnWill);
        });
    });
});
