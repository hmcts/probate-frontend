'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DamageCulpritKnown = require('app/steps/ui/will/codicilsdamageculpritknown');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('codicils-damage-reason', () => {
    let testWrapper;
    const expectedNextUrlForCodiclsDamageCulpritKnown = DamageCulpritKnown.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('CodicilsDamageReasonKnown');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('CodicilsDamageReasonKnown', null, null, [], false, {type: caseTypes.GOP});

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
            const errorsToTest = ['codicilsDamageReasonKnown'];
            testWrapper.testErrors(done, {}, 'required', errorsToTest);
        });

        it(`test it redirects to Codicil Damage Culprit page: ${expectedNextUrlForCodiclsDamageCulpritKnown}`, (done) => {
            const data = {
                codicilsDamageReasonKnown: 'optionNo'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForCodiclsDamageCulpritKnown);
        });

        it(`test it redirects to Codicil Damage Culprit page: ${expectedNextUrlForCodiclsDamageCulpritKnown}`, (done) => {
            const data = {
                codicilsDamageReasonKnown: 'optionYes',
                codicilsDamageReasonDescription: 'Damage description'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForCodiclsDamageCulpritKnown);
        });
    });
});
