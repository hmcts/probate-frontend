// eslint-disable-line max-lines
'use strict';

const TestWrapper = require('test/util/TestWrapper');
const config = require('app/config');
const ThankYou = require('app/steps/ui/thankyou/index.js');
const ihtContent = require('app/resources/en/translation/iht/method');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');

describe('documents', () => {
    let testWrapper;
    const expectedNextUrlForThankYouPage = ThankYou.getUrl();

    beforeEach(() => {
        testWrapper = new TestWrapper('Documents');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        testHelpBlockContent.runTest('Documents');

        it('test correct content loaded on the page, no codicils, no alias, single executor', (done) => {
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
                        'checklist3-item5-deedPoll',
                        'coverLetter-codicils',
                        'checkboxLabel-codicils',
                        'checklist3-item4-Form205'
                    ];
                    testWrapper.testContent(done, excludeKeys);
                });
        });

        it('test correct content loaded on the page, no codicils, no alias, multiple executors', (done) => {
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
                        'checklist3-item5-deedPoll',
                        'coverLetter-codicils',
                        'checkboxLabel-codicils',
                        'checklist3-item4-Form205'
                    ];
                    testWrapper.testContent(done, excludeKeys);
                });
        });

        it('test correct content loaded on the page, no codicils, multiple executors, no alias, with optionRenunciated', (done) => {
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
                        'checklist3-item5-deedPoll',
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

        it('test correct content loaded on the page, has codicils, no alias, single executor', (done) => {
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
                        'checklist3-item5-deedPoll',
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

        it('test correct content loaded on the page, has codicils, no alias, multiple executors', (done) => {
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
                        'checklist3-item4-Form205',
                        'checklist3-item5-deedPoll'
                    ];
                    const contentData = {
                        codicilsNumber: 1
                    };
                    testWrapper.testContent(done, excludeKeys, contentData);
                });
        });

        it('test correct content loaded on the page, no codicils, single executor, no alias, specified registry address', (done) => {
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
                        'checklist3-item5-deedPoll',
                        'coverLetter-codicils',
                        'checkboxLabel-codicils',
                        'sendDocumentsAddress',
                        'checklist3-item4-Form205'
                    ];
                    testWrapper.testContent(done, excludeKeys);
                });
        });

        it('test correct content loaded on the page, no codicils, single executor, no alias, online IHT', (done) => {
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
                        'checklist3-item5-deedPoll',
                        'coverLetter-codicils',
                        'checkboxLabel-codicils',
                        'checklist3-item4-Form205'
                    ];
                    testWrapper.testContent(done, excludeKeys);
                });
        });

        it('test correct content loaded on the page, no codicils, single executor, no alias, paper IHT, 207 or 400', (done) => {
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
                        'checklist3-item5-deedPoll',
                        'coverLetter-codicils',
                        'checkboxLabel-codicils',
                        'checklist3-item4-Form205'
                    ];
                    testWrapper.testContent(done, excludeKeys);
                });
        });

        it('test correct content loaded on the page, no codicils, single executor, no alias, paper IHT, 205', (done) => {
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
                        'checklist3-item5-deedPoll',
                        'coverLetter-codicils',
                        'checkboxLabel-codicils'
                    ];
                    testWrapper.testContent(done, excludeKeys);
                });
        });

        it('test correct content loaded on the page when only one executor name changed by deed poll', (done) => {
            const sessionData = {
                executors: {
                    list: [
                        {firstName: 'james', lastName: 'miller', isApplying: true, isApplicant: true, alias: 'jimbo fisher', aliasReason: 'Marriage'},
                        {fullName: 'ed brown', isApplying: true, currentName: 'eddie jones', currentNameReason: 'Change by deed poll'},
                        {fullName: 'bob brown', isApplying: true, currentName: 'bobbie houston', currentNameReason: 'Divorce'}
                    ]
                }
            };
            const contentData = {executorCurrentName: 'eddie jones'};
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
                    testWrapper.testContent(done, excludeKeys, contentData);
                });
        });

        it('test correct content loaded on the page when multiple executor name changed by deed poll', (done) => {
            const sessionData = {
                executors: {
                    list: [
                        {firstName: 'james', lastName: 'miller', isApplying: true, isApplicant: true, alias: 'jimbo fisher', aliasReason: 'Change by deed poll'},
                        {fullName: 'ed brown', isApplying: true, currentName: 'eddie jones', currentNameReason: 'Change by deed poll'},
                        {fullName: 'bob brown', isApplying: true, currentName: 'bobbie houston', currentNameReason: 'other', otherReason: 'Did not like my name'}
                    ]
                }
            };
            const contentData = {
                executorCurrentName: [
                    'jimbo fisher',
                    'eddie jones'
                ]
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
                    testWrapper.testContent(done, excludeKeys, contentData);
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
