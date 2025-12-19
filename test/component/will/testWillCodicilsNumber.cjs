'use strict';

const TestWrapper = require('test/util/TestWrapper');
const TaskList = require('app/steps/ui/tasklist');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');
const CodicilsHasVisibleDamage = require('app/steps/ui/will/codicilshasvisibledamage');

describe('codicils-number', () => {
    let testWrapper;
    const expectedNextUrlForTaskList = TaskList.getUrl();
    const expectedNextUrlForCodicilsDamage = CodicilsHasVisibleDamage.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('CodicilsNumber');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('CodicilsNumber', null, null, [], false, {type: caseTypes.GOP});

        it('test content loaded on the page', (done) => {
            const sessionData = {
                type: caseTypes.GOP,
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                codicilsNumber: '99'
            };

            const contentData = {codicilsNumber: '99'};
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testContent(done, contentData);
                });
        });

        it('test errors message displayed for invalid data', (done) => {
            const data = {codicilsNumber: 'abd'};

            testWrapper.testErrors(done, data, 'invalid');
        });

        it('test errors message displayed for invalid data - negative numbers', (done) => {
            const data = {codicilsNumber: '-1'};

            testWrapper.testErrors(done, data, 'zero');
        });

        it('test errors message displayed for invalid data - more than 2 numbers', (done) => {
            const data = {codicilsNumber: '100'};

            testWrapper.testErrors(done, data, 'moreThanTwo');
        });

        it('test errors message displayed for no number entered', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to TaskList page: ${expectedNextUrlForTaskList}`, (done) => {
            const data = {codicilsNumber: '1'};
            testWrapper.agent.post('/prepare-session/featureToggles')
                .send({ft_will_condition: false})
                .end(() => {
                    testWrapper.testRedirect(done, data, expectedNextUrlForTaskList);
                });
        });

        it(`test it redirects to CodicilsHasVisibleDamage page: ${expectedNextUrlForCodicilsDamage}`, (done) => {
            const data = {codicilsNumber: '1'};
            testWrapper.agent.post('/prepare-session/featureToggles')
                .send({ft_will_condition: true})
                .end(() => {
                    testWrapper.testRedirect(done, data, expectedNextUrlForCodicilsDamage);
                });
        });
    });
});
