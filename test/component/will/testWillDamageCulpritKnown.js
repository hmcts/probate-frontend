'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DamageDate = require('app/steps/ui/will/willdamagedate');
const testCommonContent = require('test/component/common/testCommonContent.js');
const caseTypes = require('app/utils/CaseTypes');

describe('will-damage-culprit', () => {
    let testWrapper;
    const expectedNextUrlForWillDamageDate = DamageDate.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('WillDamageCulpritKnown');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('WillDamageCulpritKnown', null, null, [], false, {type: caseTypes.GOP});

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
            const errorsToTest = ['willDamageCulpritKnown'];
            testWrapper.testErrors(done, {}, 'required', errorsToTest);
        });

        it('replays stored culprit names on GET', (done) => {
            const sessionData = {
                type: caseTypes.GOP,
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                will: {
                    willDamageCulpritKnown: 'optionYes',
                    willDamageCulpritName: {
                        firstName: 'Harry',
                        lastName: 'Potter'
                    }
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.agent.get('/will-damage-who')
                        .expect('Content-type', /html/)
                        .then((res) => {
                            expect(res.text).to.contain('value="Harry"');
                            expect(res.text).to.contain('value="Potter"');
                            done();
                        })
                        .catch((err) => done(err));
                });
        });

        it('retains entered first name when last name is missing', (done) => {
            const data = {
                willDamageCulpritKnown: 'optionYes',
                firstName: 'Harry'
            };

            testWrapper.agent.post('/will-damage-who')
                .type('form')
                .send(data)
                .expect('Content-type', 'text/html; charset=utf-8')
                .then((res) => {
                    expect(res.text).to.contain('Enter a last name');
                    expect(res.text).to.contain('value="Harry"');
                    done();
                })
                .catch((err) => done(err));
        });

        it(`test it redirects to Damage Date page for unknown: ${expectedNextUrlForWillDamageDate}`, (done) => {
            const data = {
                willDamageCulpritKnown: 'optionNo'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForWillDamageDate);
        });

        it(`test it redirects to Damage Date page for known: ${expectedNextUrlForWillDamageDate}`, (done) => {
            const data = {
                willDamageCulpritKnown: 'optionYes',
                firstName: 'Harry',
                lastName: 'Potter'
            };

            testWrapper.testRedirect(done, data, expectedNextUrlForWillDamageDate);
        });
    });
});
