'use strict';

const TestWrapper = require('test/util/TestWrapper');
const documentuploadData = require('test/data/documentupload');
const documentuploadContent = require('app/resources/en/translation/documentupload');
const summaryContent = require('app/resources/en/translation/summary');
const nock = require('nock');

describe('summary-documentupload-section', () => {
    let testWrapper, sessionData;

    beforeEach(() => {
        testWrapper = new TestWrapper('Summary');
        sessionData = require('test/data/documentupload');

    });

    afterEach(() => {
        testWrapper.destroy();
        nock.cleanAll();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test content loaded on the page when there is data', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    const playbackData = [
                        summaryContent.uploadedDocumentsHeading,
                        documentuploadContent.deathCertificate,
                        documentuploadData.documents.uploads[0].filename,
                        documentuploadData.documents.uploads[1].filename,
                        documentuploadData.documents.uploads[2].filename
                    ];
                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test content loaded on the page when there is no data', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send({})
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    const playbackData = [
                        summaryContent.uploadedDocumentsHeading,
                        documentuploadContent.deathCertificate,
                        summaryContent.uploadedDocumentsEmpty
                    ];
                    testWrapper.testDataPlayback(done, playbackData);
                });
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
                    const playbackData = [
                        documentuploadContent.deathCertificate
                    ];
                    Object.assign(playbackData, documentuploadData);
                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test correct content loaded on document upload section of the summary page, when no data is entered', (done) => {
            const playbackData = {
            };
            testWrapper.testDataPlayback(done, playbackData);
        });
    });
});
