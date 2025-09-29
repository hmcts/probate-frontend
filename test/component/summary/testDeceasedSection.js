'use strict';

const requireDir = require('require-directory');
const TestWrapper = require('test/util/TestWrapper');
const languageContent = require('../../../app/resources/en/translation/language');
const deceasedContent = requireDir(module, '../../../app/resources/en/translation/deceased');
const FormatName = require('app/utils/FormatName');

describe('summary-deceased-section', () => {
    let testWrapper, sessionData;

    beforeEach(() => {
        testWrapper = new TestWrapper('Summary');
        delete require.cache[require.resolve('test/data/deceased')];
        sessionData = require('test/data/deceased');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test correct content loaded on the deceased section of the summary page, when no data is entered', (done) => {
            sessionData = {
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
                        bilingual: languageContent.question,
                        firstName: deceasedContent.name.firstName,
                        lastName: deceasedContent.name.lastName,
                        alias: deceasedContent.alias.question.replace('{deceasedName}', deceasedContent.alias.theDeceased),
                        dob: deceasedContent.dob.question.replace('{deceasedName}', deceasedContent.dob.theDeceased),
                        dod: deceasedContent.dod.question.replace('{deceasedName}', deceasedContent.dod.theDeceased),
                        address: deceasedContent.address.question.replace('{deceasedName}', deceasedContent.alias.theDeceased)
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
                        bilingual: languageContent.question,
                        firstName: deceasedContent.name.firstName,
                        lastName: deceasedContent.name.lastName,
                        alias: deceasedContent.alias.question.replace('{deceasedName}', deceasedName),
                        married: deceasedContent.married.question.replace('{deceasedName}', deceasedName),
                        dob: deceasedContent.dob.question.replace('{deceasedName}', deceasedName),
                        dod: deceasedContent.dod.question.replace('{deceasedName}', deceasedName),
                        address: deceasedContent.address.question.replace('{deceasedName}', deceasedName)
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
                        questionBilingual: languageContent.question,
                        questionFirstName: deceasedContent.name.firstName,
                        questionLastName: deceasedContent.name.lastName,
                        questionAlias: deceasedContent.alias.question.replace('{deceasedName}', deceasedName),
                        questionMarried: deceasedContent.married.question.replace('{deceasedName}', deceasedName),
                        questionDob: deceasedContent.dob.question.replace('{deceasedName}', deceasedName),
                        questionDod: deceasedContent.dod.question.replace('{deceasedName}', deceasedName),
                        questionAddress: deceasedContent.address.question.replace('{deceasedName}', deceasedName)
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
