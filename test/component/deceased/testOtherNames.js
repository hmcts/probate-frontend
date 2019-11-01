'use strict';

const TestWrapper = require('test/util/TestWrapper');
const {set} = require('lodash');
const DeceasedMarried = require('app/steps/ui/deceased/married');
const testCommonContent = require('test/component/common/testCommonContent.js');

describe('deceased-otherNames', () => {
    let testWrapper;
    const expectedNextUrlForDeceasedMarried = DeceasedMarried.getUrl();

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
            testWrapper.testErrors(done, {}, 'required');
        });

        it('test otherNames schema validation when invalid firstName is entered', (done) => {
            const errorsToTest = ['firstName'];
            const data = {};
            set(data, 'otherNames.name_0.firstName', '>John');
            set(data, 'otherNames.name_0.lastName', 'Doe');

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it('test otherNames schema validation when invalid lastName is entered', (done) => {
            const errorsToTest = ['lastName'];
            const data = {};
            set(data, 'otherNames.name_0.firstName', 'John');
            set(data, 'otherNames.name_0.lastName', '>Doe');

            testWrapper.testErrors(done, data, 'invalid', errorsToTest);
        });

        it(`test it redirects to deceased married page: ${expectedNextUrlForDeceasedMarried}`, (done) => {
            const sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                }
            };
            const data = {
                otherNames: {
                    name_0: {
                        firstName: 'John',
                        lastName: 'Doe'
                    }
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testRedirect(done, data, expectedNextUrlForDeceasedMarried);
                });
        });
    });
});
