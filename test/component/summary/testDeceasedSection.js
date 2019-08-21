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

        it('test correct content loaded on the deceased section of the summary page, when section is complete', (done) => {
            const deceasedData = require('test/data/deceased');
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    delete require.cache[require.resolve('test/data/deceased')];
                    const deceasedName = FormatName.format(deceasedData.deceased);
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
            const deceasedData = require('test/data/deceased');
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    delete require.cache[require.resolve('test/data/deceased')];
                    const deceasedName = FormatName.format(deceasedData.deceased);
                    const playbackData = {
                        firstName: deceasedContent.name.firstName,
                        lastName: deceasedContent.name.lastName,
                        alias: deceasedContent.alias.question,
                        married: deceasedContent.married.question.replace('{deceasedName}', deceasedName),
                        dob: deceasedContent.dob.question,
                        dod: deceasedContent.dod.question,
                        address: deceasedContent.address.question,
                        willCodicils: willContent.codicils.question
                    };
                    Object.assign(playbackData, deceasedData.deceased, deceasedData.will);
                    playbackData.address = deceasedData.deceased.address.formattedAddress;
                    testWrapper.testDataPlayback(done, playbackData);
                });
        });
    });
});
