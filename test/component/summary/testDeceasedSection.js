const requireDir = require('require-directory');
const TestWrapper = require('test/util/TestWrapper');
const deceasedData = require('test/data/deceased');
const deceasedContent = requireDir(module, '../../../app/resources/en/translation/deceased');

describe('summary-deceased-section', () => {
    let testWrapper, sessionData;

    beforeEach(() => {
        testWrapper = new TestWrapper('Summary');
        sessionData = require('test/data/deceased');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        it('test correct content loaded on deceased section of the summary page , when no data is entered', (done) => {
            const playbackData = {};
            playbackData.firstName = deceasedContent.name.firstName;
            playbackData.lastName = deceasedContent.name.lastName;
            playbackData.alias = deceasedContent.alias.question;
            playbackData.dod = deceasedContent.dod.question;
            playbackData.dob = deceasedContent.dob.question;
            playbackData.domicile = deceasedContent.domicile.question;
            playbackData.address = deceasedContent.address.question;

            testWrapper.testDataPlayback(done, playbackData);
        });

        it('test correct content loaded on the deceased section of the summary page, when section is complete', (done) => {

            testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end((err) => {
                        if (err) {
                            throw err;
                        }
                        const playbackData = {};
                        playbackData.firstName = deceasedContent.name.firstName;
                        playbackData.lastName = deceasedContent.name.lastName;
                        playbackData.alias = deceasedContent.alias.question;
                        const deceasedName = `${deceasedData.deceased.firstName} ${deceasedData.deceased.lastName}`;
                        playbackData.married = deceasedContent.married.question.replace('{deceasedName}', deceasedName);
                        playbackData.dod = deceasedContent.dod.question;
                        playbackData.dob = deceasedContent.dob.question;
                        playbackData.domicile = deceasedContent.domicile.question;
                        playbackData.address = deceasedContent.address.question;

                        testWrapper.testDataPlayback(done, playbackData);
                    });
        });

        it('test data is played back correctly on the deceased section of the summary page', (done) => {

            testWrapper.agent.post('/prepare-session/form')
                    .send(sessionData)
                    .end((err) => {
                        if (err) {
                            throw err;
                        }
                        const playbackData = {};
                        playbackData.firstName = deceasedContent.name.firstName;
                        playbackData.lastName = deceasedContent.name.lastName;
                        playbackData.alias = deceasedContent.alias.question;
                        const deceasedName = `${deceasedData.deceased.firstName} ${deceasedData.deceased.lastName}`;
                        playbackData.married = deceasedContent.married.question.replace('{deceasedName}', deceasedName);
                        playbackData.dod = deceasedContent.dod.question;
                        playbackData.dob = deceasedContent.dob.question;
                        playbackData.domicile = deceasedContent.domicile.question;
                        playbackData.address = deceasedContent.address.question;

                        Object.assign(playbackData, deceasedData.deceased, deceasedData.will);

                        testWrapper.testDataPlayback(done, playbackData);
                    });
        });

    });
});
