'use strict';

const requireDir = require('require-directory');
const TestWrapper = require('test/util/TestWrapper');
const ihtContent = requireDir(module, '../../../app/resources/en/translation/iht');

describe('summary-iht-section', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('Summary');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test correct content loaded on the summary page iht section, when no data is entered', (done) => {
            const sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testDataPlayback(done);
                });
        });
        it('test data is played back correctly on the summary page iht section for completed 400 & 421 forms', (done) => {
            const sessionData = require('test/data/iht/probate-estate-values');
            sessionData.ccdCase = {
                state: 'Pending',
                id: 1234567890123456
            };

            sessionData.iht.form = 'optionIHT400421';
            sessionData.iht.ihtFormEstateId = 'optionIHT400421';
            sessionData.iht.calcCheckCompleted = 'optionYes';
            sessionData.iht.estateValueCompleted = 'optionYes';
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    delete require.cache[require.resolve('test/data/iht/probate-estate-values')];
                    const playbackData = {
                        calcCheckCompleted: ihtContent.calccheck.question,
                        grossValueField: ihtContent.probateestatevalues.grossValueSummary,
                        netValueField: ihtContent.probateestatevalues.netValueSummary
                    };
                    testWrapper.testDataPlayback(done, playbackData);
                });

        });

        it('test data is played back correctly on the summary page iht section for completed 400forms', (done) => {
            const sessionData = require('test/data/iht/probate-estate-values');
            sessionData.ccdCase = {
                state: 'Pending',
                id: 1234567890123456
            };

            sessionData.iht.form = 'optionIHT400';
            sessionData.iht.ihtFormEstateId = 'optionIHT400';
            sessionData.iht.calcCheckCompleted = 'optionYes';
            sessionData.iht.estateValueCompleted = 'optionYes';
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    delete require.cache[require.resolve('test/data/iht/probate-estate-values')];
                    const playbackData = {
                        calcCheckCompleted: ihtContent.calccheck.question
                    };
                    testWrapper.testDataPlayback(done, playbackData);
                });

        });
        it('test data is played back correctly on the summary page iht section for no forms completed', (done) => {
            const sessionData = require('test/data/iht/probate-estate-values');
            sessionData.ccdCase = {
                state: 'Pending',
                id: 1234567890123456
            };

            sessionData.iht.form = 'NOTAPPLICABLE';
            sessionData.iht.ihtFormEstateId = 'optionNA';
            sessionData.iht.calcCheckCompleted = 'optionYes';
            sessionData.iht.estateValueCompleted = 'optionNo';
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    delete require.cache[require.resolve('test/data/iht/probate-estate-values')];
                    const playbackData = {
                        calcCheckCompleted: ihtContent.calccheck.question
                    };
                    testWrapper.testDataPlayback(done, playbackData);
                });

        });
    });
});
