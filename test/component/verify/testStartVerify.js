'use strict';

const TestWrapper = require('test/util/TestWrapper');
const config = require('config');

describe('start-verify', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('StartVerify');
    });

    afterEach(async () => {
        await testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test correct content is loaded on the page', (done) => {
            const sessionData = {
                applicant: {
                    firstName: 'John',
                    lastName: 'TheApplicant'
                },
                deceased: {
                    firstName: 'Dave',
                    lastName: 'Bassett'
                },
                pin: '12345'
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        applicantName: 'John TheApplicant',
                        deceasedName: 'Dave Bassett',
                        applicationFormPA12: config.links.applicationFormPA12
                    };
                    testWrapper.testContent(done, contentData);
                });
        });
    });
});
