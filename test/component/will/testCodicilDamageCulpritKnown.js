'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DamageDate = require('app/steps/ui/will/codicilsdamagedate');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('codicils-damage-culprit', () => {
    let testWrapper;
    const expectedNextUrlForWillDamageDate = DamageDate.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('CodicilsDamageCulpritKnown');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('CodicilsDamageCulpritKnown', null, null, [], false, {type: caseTypes.GOP});

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
            const errorsToTest = ['codicilsDamageCulpritKnown'];
            testWrapper.testErrors(done, {}, 'required', errorsToTest);
        });

        it(`test it redirects to Damage Date page for unknown: ${expectedNextUrlForWillDamageDate}`, (done) => {
            const data = {
                codicilsDamageCulpritKnown: 'optionNo'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForWillDamageDate);
        });

        it(`test it redirects to Damage Date page for known: ${expectedNextUrlForWillDamageDate}`, (done) => {
            const data = {
                codicilsDamageCulpritKnown: 'optionYes',
                firstName: 'Harry',
                lastName: 'Potter'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForWillDamageDate);
        });
    });
});
