'use strict';

const TestWrapper = require('test/util/TestWrapper');
const config = require('app/config');
const ThankYou = require('app/steps/ui/thankyou/index.js');
const ihtContent = require('app/resources/en/translation/iht/method');

describe('documents-page', () => {
    let testWrapper;
    const expectedNextUrlForThankYouPage = ThankYou.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('Documents');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test correct content loaded on the page, no codicils, single executor', (done) => {
            const sessionData = {
                executors: {}
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = [
                        'checklist1-item2',
                        'checklist2Header',
                        'checklist2-item1',
                        'checklist2-item2',
                        'checklist3-item1-codicils',
                        'checklist3-item3',
                        'coverLetter-codicils',
                        'checkboxLabel-codicils',
                        'checklist3-item4-Form205'
                    ];
                    testWrapper.testContent(done, excludeKeys);
                });
        });

        it('test correct content loaded on the page, no codicils, multiple executors', (done) => {
            const sessionData = {
                executors: {
                    list: [
                        {isApplying: true, isApplicant: true},
                        {isApplying: true}
                    ]
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = [
                        'checklist1-item2',
                        'checklist2-item2',
                        'checklist3-item1-codicils',
                        'checklist3-item3',
                        'coverLetter-codicils',
                        'checkboxLabel-codicils',
                        'checklist3-item4-Form205'
                    ];
                    testWrapper.testContent(done, excludeKeys);
                });
        });

        it('test correct content loaded on the page, no codicils, multiple executors with optionRenunciated', (done) => {
            const sessionData = {
                executors: {
                    executorsNumber: 2,
                    list: [
                        {isApplying: true, isApplicant: true},
                        {notApplyingKey: 'optionRenunciated'}
                    ]
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = [
                        'checklist1-item2',
                        'checklist2Header',
                        'checklist2-item1',
                        'checklist2-item2',
                        'checklist3-item1-codicils',
                        'coverLetter-codicils',
                        'checkboxLabel-codicils',
                        'checklist3-item4-Form205'
                    ];
                    const contentData = {
                        renunciationFormLink: config.links.renunciationForm
                    };
                    testWrapper.testContent(done, excludeKeys, contentData);
                });
        });

        it('test correct content loaded on the page, has codicils, single executor', (done) => {
            const sessionData = {
                will: {
                    codicilsNumber: '1'
                },
                executors: {}
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = [
                        'checklist2Header',
                        'checklist2-item1',
                        'checklist2-item2',
                        'checklist3-item1',
                        'checklist3-item3',
                        'coverLetter',
                        'checkboxLabel',
                        'checklist3-item4-Form205'
                    ];
                    const contentData = {
                        codicilsNumber: 1
                    };
                    testWrapper.testContent(done, excludeKeys, contentData);
                });
        });

        it('test correct content loaded on the page, has codicils, multiple executors', (done) => {
            const sessionData = {
                will: {
                    codicilsNumber: '1'
                },
                executors: {
                    list: [
                        {isApplying: true, isApplicant: true},
                        {isApplying: true}
                    ]
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = [
                        'checklist3-item1',
                        'checklist3-item3',
                        'coverLetter',
                        'checkboxLabel',
                        'checklist3-item4-Form205'
                    ];
                    const contentData = {
                        codicilsNumber: 1
                    };
                    testWrapper.testContent(done, excludeKeys, contentData);
                });
        });

        it('test correct content loaded on the page, no codicils, single executor, specified registry address', (done) => {
            const sessionData = {
                executors: {},
                registry: {
                    address: '1 Red Street\nLondon\nO1 1OL'
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = [
                        'checklist1-item2',
                        'checklist2Header',
                        'checklist2-item1',
                        'checklist2-item2',
                        'checklist3-item1-codicils',
                        'checklist3-item3',
                        'coverLetter-codicils',
                        'checkboxLabel-codicils',
                        'sendDocumentsAddress',
                        'checklist3-item4-Form205'
                    ];
                    testWrapper.testContent(done, excludeKeys);
                });
        });

        it('test correct content loaded on the page, no codicils, single executor, online IHT', (done) => {
            const sessionData = {
                executors: {},
                iht: {method: ihtContent.onlineOption}
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = [
                        'checklist1-item2',
                        'checklist2Header',
                        'checklist2-item1',
                        'checklist2-item2',
                        'checklist3-item1-codicils',
                        'checklist3-item3',
                        'coverLetter-codicils',
                        'checkboxLabel-codicils',
                        'checklist3-item4-Form205'
                    ];
                    testWrapper.testContent(done, excludeKeys);
                });
        });

        it('test correct content loaded on the page, no codicils, single executor, paper IHT, 207 or 400', (done) => {
            const sessionData = {
                executors: {},
                iht: {
                    method: ihtContent.paperOption,
                    form: '207'
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = [
                        'checklist1-item2',
                        'checklist2Header',
                        'checklist2-item1',
                        'checklist2-item2',
                        'checklist3-item1-codicils',
                        'checklist3-item3',
                        'coverLetter-codicils',
                        'checkboxLabel-codicils',
                        'checklist3-item4-Form205'
                    ];
                    testWrapper.testContent(done, excludeKeys);
                });
        });

        it('test correct content loaded on the page, no codicils, single executor, paper IHT, 205', (done) => {
            const sessionData = {
                executors: {},
                iht: {
                    method: ihtContent.paperOption,
                    form: '205'
                }
            };
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = [
                        'checklist1-item2',
                        'checklist2Header',
                        'checklist2-item1',
                        'checklist2-item2',
                        'checklist3-item1-codicils',
                        'checklist3-item3',
                        'coverLetter-codicils',
                        'checkboxLabel-codicils'
                    ];
                    testWrapper.testContent(done, excludeKeys);
                });
        });
        it('test errors message displayed for missing data', (done) => {
            testWrapper.testErrors(done, {}, 'required', ['sentDocuments']);
        });

        it(`test it redirects to next page: ${expectedNextUrlForThankYouPage}`, (done) => {
            const data = {
                sentDocuments: true
            };
            testWrapper.testRedirect(done, data, expectedNextUrlForThankYouPage);
        });
    });
});
