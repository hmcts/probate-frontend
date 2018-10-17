'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DocumentsPage = require('app/steps/ui/documents/index');

describe('redirect to documents', () => {
    let testWrapper, sessionData;
    const expectedUrlForDocumentsPage = DocumentsPage.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('CopiesUk');
        sessionData = {
            'submissionReference': 'testSubmissionReference',
            'payment': {
                'status': 'Success'
            }
        };
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    it(`test it redirects to Documents page when the application was submitted: ${expectedUrlForDocumentsPage}`, (done) => {
        testWrapper.agent.post('/prepare-session/form')
            .send(sessionData)
            .end(() => {

                testWrapper.agent.get(testWrapper.pageUrl)
                    .expect('location', 'documents')
                    .expect(302)
                    .end((err) => {
                        testWrapper.server.http.close();
                        if (err) {
                            done(err);
                        } else {
                            done();
                        }
                    });
            });
    });

});
