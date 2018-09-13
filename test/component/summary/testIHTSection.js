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
            const playbackData = {};
            playbackData.method = ihtContent.method.question;

            testWrapper.testDataPlayback(done, playbackData);
        });

        it('test correct content loaded on the summary page iht section, when section is complete (online)', (done) => {
            const sessionData = require('test/data/ihtOnline');
            testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end((err) => {
                        if (err) {
                            throw err;
                        }
                        const playbackData = {};
                        playbackData.method = ihtContent.method.question;
                        playbackData.identifier = ihtContent.identifier.question;
                        playbackData.grossValue = ihtContent.value.grossValue;
                        playbackData.netValue = ihtContent.value.netValue;

                        testWrapper.testDataPlayback(done, playbackData);
                    });
        });

        it('test correct content loaded on the summary page iht section, when section is complete (paper)', (done) => {
            const sessionData = require('test/data/ihtPaper');
            sessionData.form = '205';
            testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end((err) => {
                        if (err) {
                            throw err;
                        }
                        const playbackData = {};
                        playbackData.method = ihtContent.method.question;
                        playbackData.option = ihtContent.paper.question;
                        playbackData.grossValue = ihtContent.value.grossValue;
                        playbackData.netValue = ihtContent.value.netValue;

                        testWrapper.testDataPlayback(done, playbackData);
                    });
        });

        it('test data is played back correctly on the summary page iht section (online)', (done) => {
            const sessionData = require('test/data/ihtOnline');
            testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end((err) => {
                        if (err) {
                            throw err;
                        }
                        const playbackData = {};
                        playbackData.method = ihtContent.method.question;
                        playbackData.identifier = ihtContent.identifier.question;
                        playbackData.grossValue = ihtContent.value.grossValue;
                        playbackData.netValue = ihtContent.value.netValue;

                        Object.assign(playbackData, sessionData.iht);

                        testWrapper.testDataPlayback(done, playbackData);
                    });
        });

        it('test data is played back correctly on the summary page iht section (paper205)', (done) => {
            const sessionData = require('test/data/ihtPaper');
            sessionData.form = '205';
            testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end((err) => {
                        if (err) {
                            throw err;
                        }
                        const playbackData = {};
                        playbackData.method = ihtContent.method.question;
                        playbackData.option = ihtContent.paper.question;
                        playbackData.grossValue = ihtContent.value.grossValue;
                        playbackData.netValue = ihtContent.value.netValue;

                        Object.assign(playbackData, sessionData.iht);

                        testWrapper.testDataPlayback(done, playbackData);
                    });
        });

        it('test data is played back correctly on the summary page iht section (paper207)', (done) => {
            const sessionData = require('test/data/ihtPaper');
            sessionData.form = '207';
            testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end((err) => {
                        if (err) {
                            throw err;
                        }
                        const playbackData = {};
                        playbackData.method = ihtContent.method.question;
                        playbackData.option = ihtContent.paper.question;
                        playbackData.grossValue = ihtContent.value.grossValue;
                        playbackData.netValue = ihtContent.value.netValue;

                        Object.assign(playbackData, sessionData.iht);

                        testWrapper.testDataPlayback(done, playbackData);
                    });
        });

        it('test data is played back correctly on the summary page iht section (paper400)', (done) => {
            const sessionData = require('test/data/ihtPaper');
            sessionData.form = '400';
            testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end((err) => {
                        if (err) {
                            throw err;
                        }
                        const playbackData = {};
                        playbackData.ihtMethod = ihtContent.method.question;
                        playbackData.ihtOption = ihtContent.paper.question;
                        playbackData.ihtGrossValue = ihtContent.value.grossValue;
                        playbackData.ihtNetValue = ihtContent.value.netValue;

                        Object.assign(playbackData, sessionData.iht);

                        testWrapper.testDataPlayback(done, playbackData);
                    });
        });

    });
});
