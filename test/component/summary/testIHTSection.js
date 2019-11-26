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
                    const playbackData = {
                        method: ihtContent.method.question
                    };

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test correct content loaded on the summary page iht section, when section is complete (online)', (done) => {
            const sessionData = require('test/data/ihtOnline');
            sessionData.ccdCase = {
                state: 'Pending',
                id: 1234567890123456
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    delete require.cache[require.resolve('test/data/ihtOnline')];
                    const playbackData = {
                        method: ihtContent.method.question,
                        identifier: ihtContent.identifier.question,
                        grossValue: ihtContent.value.grossValue,
                        netValue: ihtContent.value.netValue
                    };

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test correct content loaded on the summary page iht section, when section is complete (paper)', (done) => {
            const sessionData = require('test/data/ihtPaper');
            sessionData.ccdCase = {
                state: 'Pending',
                id: 1234567890123456
            };
            sessionData.iht.form = 'IHT205';

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    delete require.cache[require.resolve('test/data/ihtPaper')];
                    const playbackData = {
                        method: ihtContent.method.question,
                        option: ihtContent.paper.question,
                        grossValue: ihtContent.value.grossValue,
                        netValue: ihtContent.value.netValue
                    };

                    testWrapper.testDataPlayback(done, playbackData, ['form']);
                });
        });

        it('test data is played back correctly on the summary page iht section (online)', (done) => {
            const sessionData = require('test/data/ihtOnline');
            sessionData.ccdCase = {
                state: 'Pending',
                id: 1234567890123456
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    delete require.cache[require.resolve('test/data/ihtOnline')];
                    const playbackData = {
                        method: ihtContent.method.question,
                        identifier: ihtContent.identifier.question,
                        grossValue: ihtContent.value.grossValue,
                        netValue: ihtContent.value.netValue
                    };
                    Object.assign(playbackData, sessionData.iht);
                    console.log(playbackData);
                    playbackData.method = playbackData.method.replace('optionOnline', ihtContent.method.optionOnline);

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test data is played back correctly on the summary page iht section (paper205)', (done) => {
            const sessionData = require('test/data/ihtPaper');
            sessionData.ccdCase = {
                state: 'Pending',
                id: 1234567890123456
            };
            sessionData.iht.form = 'IHT205';

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    delete require.cache[require.resolve('test/data/ihtPaper')];
                    const playbackData = {
                        method: ihtContent.method.question,
                        option: ihtContent.paper.question,
                        grossValue: ihtContent.value.grossValue,
                        netValue: ihtContent.value.netValue
                    };
                    Object.assign(playbackData, sessionData.iht);
                    playbackData.method = playbackData.method.replace('optionPaper', ihtContent.method.optionPaper);

                    testWrapper.testDataPlayback(done, playbackData, ['form']);
                });
        });

        it('test data is played back correctly on the summary page iht section (paper207)', (done) => {
            const sessionData = require('test/data/ihtPaper');
            sessionData.ccdCase = {
                state: 'Pending',
                id: 1234567890123456
            };
            sessionData.iht.form = 'IHT207';

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    delete require.cache[require.resolve('test/data/ihtPaper')];
                    const playbackData = {
                        method: ihtContent.method.question,
                        option: ihtContent.paper.question,
                        grossValue: ihtContent.value.grossValue,
                        netValue: ihtContent.value.netValue
                    };
                    Object.assign(playbackData, sessionData.iht);
                    playbackData.method = playbackData.method.replace('optionPaper', ihtContent.method.optionPaper);

                    testWrapper.testDataPlayback(done, playbackData, ['form']);
                });
        });

        it('test data is played back correctly on the summary page iht section (paper400)', (done) => {
            const sessionData = require('test/data/ihtPaper');
            sessionData.ccdCase = {
                state: 'Pending',
                id: 1234567890123456
            };
            sessionData.iht.form = 'IHT400421';

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    delete require.cache[require.resolve('test/data/ihtPaper')];
                    const playbackData = {
                        ihtMethod: ihtContent.method.question,
                        ihtOption: ihtContent.paper.question,
                        ihtGrossValue: ihtContent.value.grossValue,
                        ihtNetValue: ihtContent.value.netValue
                    };
                    Object.assign(playbackData, sessionData.iht);
                    playbackData.method = playbackData.method.replace('optionPaper', ihtContent.method.optionPaper);

                    testWrapper.testDataPlayback(done, playbackData, ['form']);
                });
        });
    });
});
