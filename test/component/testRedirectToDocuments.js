'use strict';

const TestWrapper = require('test/util/TestWrapper');
const DocumentsPage = require('app/steps/ui/documents');

describe('redirect to documents', () => {
    let testWrapper, sessionData;
    const expectedUrlForDocumentsPage = DocumentsPage.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('CopiesUk');
        sessionData = {
            ccdCase: {
                state: 'CasePrinted',
                id: 1535395401245028
            },
            declaration: {
                declarationCheckbox: 'true'
            },
            payment: {
                status: 'Success'
            }
        };
    });

    afterEach(async () => {
        await testWrapper.destroy();
    });

    it(`test it redirects to Documents page when the application was submitted: ${expectedUrlForDocumentsPage}`, (done) => {
        testWrapper.agent.post('/prepare-session/form')
            .send(sessionData)
            .end(() => {
                try {
                    testWrapper.agent.get(testWrapper.pageUrl)
                        .expect('location', '/documents')
                        .expect(302)
                        .end((err) => {
                            // testWrapper.server.http.close();
                            if (err) {
                                done(err);
                            } else {
                                done();
                            }
                        });
                } catch (e) {
                    console.error(e.message);
                    done(e);
                }
            });
    });

    it(`test it redirects to Documents page when the application was submitted and declarationCheckbox data is pruned: ${expectedUrlForDocumentsPage}`, (done) => {
        sessionData = {
            ccdCase: {
                state: 'CasePrinted',
                id: 1535395401245028
            },
            payment: {
                status: 'Success'
            }
        };

        testWrapper.agent.post('/prepare-session/form')
            .send(sessionData)
            .end(() => {
                try {
                    testWrapper.agent.get(testWrapper.pageUrl)
                        .expect('location', '/documents')
                        .expect(302)
                        .end((err) => {
                            // testWrapper.server.http.close();
                            if (err) {
                                done(err);
                            } else {
                                done();
                            }
                        });
                } catch (e) {
                    console.error(e.message);
                    done(e);
                }
            });
    });
});
