'use strict';

const TestWrapper = require('test/util/TestWrapper');
const documentuploadData = require('test/data/documentupload');
const documentuploadContent = require('../../../app/resources/en/translation/documentupload.json');

describe('summary-documentupload-section', () => {
    let testWrapper, sessionData;

    beforeEach(() => {
        testWrapper = new TestWrapper('Summary');
        sessionData = require('test/data/documentupload');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe.only('Verify Content, Errors and Redirection', () => {
        it('test correct content loaded on document upload section of the summary page , when no data is entered', (done) => {
            const playbackData = {
            };
            testWrapper.testDataPlayback(done, playbackData);
        });

        it('test correct content loaded on document upload section of the summary page, when section is complete', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    const playbackData = {
                        deathCertificate: documentuploadContent.deathCertificate,
                    };
                    testWrapper.testDataPlayback(done, playbackData);
                });
        });
        it('test data is played back correctly on document upload section of the summary page', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    const playbackData = {
                        deathCertificate: documentuploadContent.deathCertificate,
                    };
                    Object.assign(playbackData, documentuploadData);
                    testWrapper.testDataPlayback(done, playbackData);
                });
        });
    });
});
