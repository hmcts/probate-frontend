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

        it('test data is played back correctly on the summary page iht section if death certificate and estate not valued', (done) => {
            const sessionData = require('test/data/iht/estate-valued-no');
            sessionData.ccdCase = {
                state: 'Pending',
                id: 1234567890123456
            };
            sessionData.deceased.deathCertificate = 'Death certificate';
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    delete require.cache[require.resolve('test/data/iht/estate-valued-no')];
                    const playbackData = {
                        estateValueCompleted: ihtContent.estatevalued.question,
                        estateGrossValue: ihtContent.ihtestatevalues.estateGrossValue,
                        estateNetValue: ihtContent.ihtestatevalues.estateNetValue,
                        estateNetQualifyingValue: ihtContent.ihtestatevalues.estateNetQualifyingValue
                    };
                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test data is played back correctly on the summary page iht section if eng translation in foreign death certificate and estate not valued', (done) => {
            const sessionData = require('test/data/iht/estate-valued-no');
            sessionData.ccdCase = {
                state: 'Pending',
                id: 1234567890123456
            };
            sessionData.deceased.foreignDeathCertTranslation = 'optionYes';
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    delete require.cache[require.resolve('test/data/iht/estate-valued-no')];
                    const playbackData = {
                        estateValueCompleted: ihtContent.estatevalued.question,
                        estateGrossValue: ihtContent.ihtestatevalues.estateGrossValue,
                        estateNetValue: ihtContent.ihtestatevalues.estateNetValue,
                        estateNetQualifyingValue: ihtContent.ihtestatevalues.estateNetQualifyingValue,
                        deceasedHadLateSpouseOrCivilPartner: ihtContent.deceasedlatespousecivilpartner.question,
                        unusedAllowanceClaimed: ihtContent.unusedallowanceclaimed.question
                    };
                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test data is played back correctly on the summary page iht section for excepted estate completed forms', (done) => {
            const sessionData = require('test/data/iht/probate-estate-values');
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
                    delete require.cache[require.resolve('test/data/iht/probate-estate-values')];
                    const playbackData = {
                        estateValueCompleted: ihtContent.estatevalued.question,
                        grossValueField: ihtContent.probateestatevalues.grossValueSummary,
                        netValueField: ihtContent.probateestatevalues.netValueSummary
                    };
                    testWrapper.testDataPlayback(done, playbackData);
                });

        });
    });
});
