'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DeceasedWrittenWishes = require('app/steps/ui/will/deceasedwrittenwishes');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('codicils-damage-date', () => {
    let testWrapper;
    const expectedNextUrl = DeceasedWrittenWishes.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('CodicilsDamageDate');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('CodicilsDamageDate', null, null, [], false, {type: caseTypes.GOP});

        it('test correct content loaded on the page', (done) => {
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
            const errorsToTest = ['codicilsDamageDateKnown'];
            testWrapper.testErrors(done, {}, 'required', errorsToTest);
        });

        it(`test it redirects to tasklist: ${expectedNextUrl}`, (done) => {
            const data = {
                codicilsHasVisibleDamage: 'optionYes',
                codicilsDamageDateKnown: 'optionNo'
            };

            testWrapper.testRedirect(done, data, expectedNextUrl);
        });
    });
});
