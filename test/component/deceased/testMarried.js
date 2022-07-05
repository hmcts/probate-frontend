'use strict';

const TestWrapper = require('test/util/TestWrapper');
const WillCodicils = require('app/steps/ui/will/codicils');
const WillHasVisibleDamage = require('app/steps/ui/will/willhasvisibledamage');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('deceased-married', () => {
    let testWrapper;
    const expectedNextUrlForWillCodicils = WillCodicils.getUrl();
    const expectedNextUrlForWillDamage = WillHasVisibleDamage.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedMarried');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('DeceasedMarried', null, null, [], false, {type: caseTypes.GOP});

        it('test correct content is loaded on the page', (done) => {
            const sessionData = {
                type: caseTypes.GOP,
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                deceased: {
                    firstName: 'Mana',
                    lastName: 'Manah'
                }
            };
            const contentToExclude = ['questionWithCodicil', 'legendWithCodicil'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {deceasedName: 'Mana Manah'};

                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test correct content is loaded on the page when there are codicils', (done) => {
            const sessionData = {
                type: caseTypes.GOP,
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                deceased: {
                    firstName: 'Mana',
                    lastName: 'Manah'
                },
                will: {
                    codicils: 'optionYes'
                }
            };
            const contentToExclude = ['question', 'legend'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {deceasedName: 'Mana Manah'};

                    testWrapper.testContent(done, contentData, contentToExclude);
                });

        });

        it('test deceased married schema validation when no data is entered', (done) => {
            testWrapper.testErrors(done, {}, 'required');
        });

        it(`test it redirects to Will Codicils page for FT off: ${expectedNextUrlForWillCodicils}`, (done) => {
            const data = {
                married: 'optionNo'
            };

            testWrapper.agent.post('/prepare-session/featureToggles')
                .send({ft_will_condition: false})
                .end(() => {
                    testWrapper.testRedirect(done, data, expectedNextUrlForWillCodicils);
                });
        });

        it(`test it redirects to Will Damage page for FT on: ${expectedNextUrlForWillDamage}`, (done) => {
            const data = {
                married: 'optionNo'
            };

            testWrapper.agent.post('/prepare-session/featureToggles')
                .send({ft_will_condition: true})
                .end(() => {
                    testWrapper.testRedirect(done, data, expectedNextUrlForWillDamage);
                });
        });
    });
});
