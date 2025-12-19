'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DamageCulpritKnown = require('app/steps/ui/will/willdamageculpritknown');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('will-damage-reason', () => {
    let testWrapper;
    const expectedNextUrlForWillDamageCulpritKnown = DamageCulpritKnown.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('WillDamageReasonKnown');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('WillDamageReasonKnown', null, null, [], false, {type: caseTypes.GOP});

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
            const errorsToTest = ['willDamageReasonKnown'];
            testWrapper.testErrors(done, {}, 'required', errorsToTest);
        });

        it(`test it redirects to Damage Culprit page: ${expectedNextUrlForWillDamageCulpritKnown}`, (done) => {
            const data = {
                willDamageReasonKnown: 'optionNo'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForWillDamageCulpritKnown);
        });

        it(`test it redirects to Damage Culprit page: ${expectedNextUrlForWillDamageCulpritKnown}`, (done) => {
            const data = {
                willDamageReasonKnown: 'optionYes',
                willDamageReasonDescription: 'Damage description'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForWillDamageCulpritKnown);
        });
    });
});
