const requireDir = require('require-directory');
const TestWrapper = require('test/util/TestWrapper');
const willData = require('test/data/will');
const willContent = requireDir(module, '../../../app/resources/en/translation/will');
const applicantContent = requireDir(module, '../../../app/resources/en/translation/applicant');

describe('summary-will-section', () => {
    let testWrapper, sessionData;

    beforeEach(() => {
        testWrapper = new TestWrapper('Summary');
        sessionData = require('test/data/will');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test correct content loaded on the summary page will section, when no data is entered', (done) => {
            const playbackData = {};
            playbackData.willLeft = willContent.left.question;
            playbackData.willOriginal = willContent.original.question;
            playbackData.willCodicils = willContent.codicils.question;
            playbackData.applicantExecutor = applicantContent.executor.question;

            testWrapper.testDataPlayback(done, playbackData);
        });

        it('test correct content loaded on the summary page will section, when section is complete', (done) => {

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    const playbackData = {};
                    playbackData.willLeft = willContent.left.question;
                    playbackData.willOriginal = willContent.original.question;
                    playbackData.date = willContent.date.question;
                    playbackData.dateQuestion = willContent.date.willDateQuestion;
                    playbackData.willCodicils = willContent.codicils.question;
                    playbackData.applicantExecutor = applicantContent.executor.question;

                    testWrapper.testDataPlayback(done, playbackData);
                    });
        });

        it('test data is played back correctly on the summary page will section', (done) => {

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    const playbackData = {};
                    playbackData.willLeft = willContent.left.question;
                    playbackData.willOriginal = willContent.original.question;
                    playbackData.date = willContent.date.question;
                    playbackData.dateQuestion = willContent.date.willDateQuestion;
                    playbackData.willCodicils = willContent.codicils.question;
                    playbackData.applicantExecutor = applicantContent.executor.question;

                    Object.assign(playbackData, willData.will, willData.applicant);

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

    });
});
