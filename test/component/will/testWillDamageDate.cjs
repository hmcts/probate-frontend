'use strict';

const TestWrapper = require('test/util/TestWrapper');
const Codicils = require('app/steps/ui/will/codicils');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('will-damage-date', () => {
    let testWrapper;
    const expectedNextUrlForCodicils = Codicils.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('WillDamageDate');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('WillDamageDate', null, null, [], false, {type: caseTypes.GOP});

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
            const errorsToTest = ['willDamageDateKnown'];
            testWrapper.testErrors(done, {}, 'required', errorsToTest);
        });

        it(`test it redirects to Damage Reason page: ${expectedNextUrlForCodicils}`, (done) => {
            const data = {
                willHasVisibleDamage: 'optionYes',
                willDamageDateKnown: 'optionNo'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForCodicils);
        });
    });
});
