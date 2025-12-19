'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedOtherNames = require('app/steps/ui/deceased/otherNames');
const DeceasedMarried = require('app/steps/ui/deceased/married');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('deceased-alias', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedOtherNames = DeceasedOtherNames.getUrl();
    const expectedNextUrlForDeceasedMarried = DeceasedMarried.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedAlias');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('DeceasedAlias');

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
            const contentToExclude = ['theDeceased', 'intestacyParagraph1'];

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

        it(`test it redirects to deceased other names page: ${expectedNextUrlForDeceasedOtherNames}`, (done) => {
            const data = {
                alias: 'optionYes'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedOtherNames);
        });
        it(`test it redirects to deceased married page: ${expectedNextUrlForDeceasedMarried}`, (done) => {
            const data = {
                alias: 'optionNo'
            };

            testWrapper.agent.post('/prepare-session/form')
                .end(() => {
                    testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedMarried);
                });
        });
    });
});
