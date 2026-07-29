'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedDob = require('../../../app/steps/ui/deceased/dob');
const testCommonContent = require('test/component/common/testCommonContent.js');

describe('deceased-alias-name-on-will', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedDob = DeceasedDob.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedAliasNameOnWill');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('DeceasedAliasNameOnWill');

        it('test right content loaded on the page', (done) => {
            const sessionData = {
                ccdCase: {
                    state: 'Pending',
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

                    testWrapper.testContent(done, contentData);
                });
        });

        it('test alias schema validation when no data is entered', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to Deceased Name As On Will page: ${expectedNextUrlForDeceasedDob}`, (done) => {
            const data = {
                aliasFirstNameOnWill: 'Bob',
                aliasLastNameOnWill: 'Smith'
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedDob);
        });
    });
});
