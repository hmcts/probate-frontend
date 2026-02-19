'use strict';

const TestWrapper = require('test/util/TestWrapper');
const testCommonContent = require('test/component/common/testCommonContent.js');

describe('deceased-otherNames', () => {
    let testWrapper;

    beforeEach(() => {
        testWrapper = new TestWrapper('DeceasedOtherNames');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testCommonContent.runTest('DeceasedOtherNames');

        it('test right content loaded on the page', (done) => {
            const sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                deceased: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            };
            const contentToExclude = ['otherName', 'removeName'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {deceasedName: 'John Doe'};

                    testWrapper.testContent(done, contentData, contentToExclude);
                });
        });

        it('test right content loaded on the page when deceased has other names', (done) => {
            const sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                },
                deceased: {
                    firstName: 'John',
                    lastName: 'Doe',
                    otherNames: {
                        name_0: {
                            firstName: 'James',
                            lastName: 'Miller'
                        },
                        name_1: {
                            firstName: 'Henry',
                            lastName: 'Hat'
                        }
                    }
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const contentData = {
                        deceasedName: 'John Doe'
                    };

                    testWrapper.testContent(done, contentData);
                });
        });

        it('test otherNames schema validation when no data is entered', (done) => {
            const sessionData = {
                deceased: {
                    firstName: 'John',
                    lastName: 'Doe',
                    otherNames: {
                        name_0: {
                            firstName: '',
                            lastName: ''
                        }
                    }
                }
            };
            const errorsToTest = ['firstName', 'lastName'];

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const data = {
                        deceasedName: 'John Doe'
                    };

                    testWrapper.testErrors(done, data, 'required', errorsToTest);
                });
        });
    });
});
