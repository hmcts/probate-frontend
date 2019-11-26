'use strict';

const requireDir = require('require-directory');
const TestWrapper = require('test/util/TestWrapper');
const deceasedContent = requireDir(module, '../../../app/resources/en/translation/deceased');
const willContent = requireDir(module, '../../../app/resources/en/translation/will');
const FormatName = require('app/utils/FormatName');

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
        it('test correct content loaded on the deceased section of the summary page, when no data is entered', (done) => {
            const sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    const playbackData = {
                        firstName: deceasedContent.name.firstName,
                        lastName: deceasedContent.name.lastName,
                        alias: deceasedContent.alias.question.replace('{deceasedName}', deceasedContent.alias.theDeceased),
                        dob: deceasedContent.dob.question,
                        dod: deceasedContent.dod.question,
                        address: deceasedContent.address.question,
                        willCodicils: willContent.codicils.question
                    };

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test correct content loaded on the deceased section of the summary page, when section is complete', (done) => {
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
                    delete require.cache[require.resolve('test/data/deceased')];
                    const deceasedName = FormatName.format(sessionData.deceased);
                    const playbackData = {
                        firstName: deceasedContent.name.firstName,
                        lastName: deceasedContent.name.lastName,
                        alias: deceasedContent.alias.question.replace('{deceasedName}', deceasedName),
                        married: deceasedContent.married.question.replace('{deceasedName}', deceasedName),
                        dob: deceasedContent.dob.question,
                        dod: deceasedContent.dod.question,
                        address: deceasedContent.address.question,
                        willCodicils: willContent.codicils.question
                    };

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test data is played back correctly on the deceased section of the summary page', (done) => {
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
                    delete require.cache[require.resolve('test/data/deceased')];
                    const deceasedName = FormatName.format(sessionData.deceased);
                    const playbackData = {
                        questionFirstName: deceasedContent.name.firstName,
                        questionLastName: deceasedContent.name.lastName,
                        questionAlias: deceasedContent.alias.question.replace('{deceasedName}', deceasedName),
                        questionMarried: deceasedContent.married.question.replace('{deceasedName}', deceasedName),
                        questionDob: deceasedContent.dob.question,
                        questionDod: deceasedContent.dod.question,
                        questionAddress: deceasedContent.address.question,
                        questionWillCodicils: willContent.codicils.question
                    };
                    Object.assign(playbackData, sessionData.deceased);
                    playbackData.alias = deceasedContent.alias[playbackData.alias];
                    playbackData.married = deceasedContent.married[playbackData.married];
                    playbackData.domicile = deceasedContent.married[playbackData.domicile];

                    playbackData.address = sessionData.deceased.address.formattedAddress;

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });
    });
});
