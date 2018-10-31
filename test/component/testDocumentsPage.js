// eslint-disable-line max-lines
'use strict';

const TestWrapper = require('test/util/TestWrapper');
const config = require('app/config');
const ThankYou = require('app/steps/ui/thankyou/index.js');
const ihtContent = require('app/resources/en/translation/iht/method');
const testHelpBlockContent = require('test/component/common/testHelpBlockContent.js');
const nock = require('nock');
const featureToggleUrl = config.featureToggles.url;
const featureTogglePath = `${config.featureToggles.path}/${config.featureToggles.document_upload}`;

describe('documents-page', () => {
    let testWrapper;
    const expectedNextUrlForThankYouPage = ThankYou.getUrl();
    const sessionData = {
        ccdCase: {
            state: 'CaseCreated',
            id: '1234-1235-1236-1237'
        }
    };

    beforeEach(() => {
        delete sessionData.executors;
        delete sessionData.will;
        delete sessionData.registry;
        delete sessionData.iht;
        testWrapper = new TestWrapper('Documents');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {

        testHelpBlockContent.runTest('WillLeft');

        it('test correct content loaded on the page, no codicils, no alias, single executor (Feature Toggle OFF)', (done) => {
            sessionData.executors = {};
            nock(featureToggleUrl)
                .get(featureTogglePath)
                .reply(200, 'false');

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = [
                        'old_checklist1-item2',
                        'old_checklist2Header',
                        'old_checklist2-item1',
                        'old_checklist2-item2',
                        'old_checklist3-item1-codicils',
                        'old_checklist3-item3',
                        'old_checklist3-item5-deedPoll',
                        'old_coverLetter-codicils',
                        'old_checklist3-item4-Form205',
                        'header',
                        'heading1',
                        'heading2',
                        'heading3',
                        'text1',
                        'text2',
                        'text3',
                        'text4',
                        'text5',
                        'text6',
                        'address',
                        'checklist1-item1-no-codicils',
                        'checklist1-item1-codicils',
                        'checklist1-item2',
                        'checklist2-item1',
                        'checklist2-item2',
                        'checklist2-item3-will-uploaded',
                        'checklist2-item4-iht205',
                        'checklist2-item5-renunciated',
                        'checklist2-item6-deed-poll',
                        'checkboxLabel-codicils'
                    ];
                    testWrapper.testContent(done, excludeKeys);
                });
        });
        it('test correct content loaded on the page, no codicils, no alias, single executor (Feature Toggle ON)', (done) => {
            sessionData.executors = {};
            nock(featureToggleUrl)
                .get(featureTogglePath)
                .reply(200, 'true');

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = [
                        'old_header',
                        'old_printPage',
                        'old_heading2',
                        'old_checklist1Header',
                        'old_checklist1-item1',
                        'old_checklist1-item2',
                        'old_checklist2Header',
                        'old_checklist2-item1',
                        'old_checklist2-item2',
                        'old_checklist3HeaderNumber',
                        'old_checklist3HeaderNumberMultipleExecutors',
                        'old_checklist3Header',
                        'old_checklist3-item1',
                        'old_checklist3-item1-codicils',
                        'old_checklist3-item2',
                        'old_checklist3-item3',
                        'old_checklist3-item4-Form205',
                        'old_checklist3-item5-deedPoll',
                        'old_coverLetter',
                        'old_coverLetter-codicils',
                        'old_warning',
                        'old_heading3',
                        'old_sendDocuments',
                        'old_sendDocumentsAddress',
                        'text6',
                        'checklist1-item1-codicils',
                        'checklist2-item3-will-uploaded',
                        'checklist2-item4-iht205',
                        'checklist2-item5-renunciated',
                        'checklist2-item6-deed-poll',
                        'checkboxLabel-codicils'
                    ];
                    testWrapper.testContent(done, excludeKeys);
                });
        });

        it('test correct content loaded on the page, no codicils, no alias, multiple executors (Feature Toggle OFF)', (done) => {
            sessionData.executors = {
                list: [
                    {isApplying: true, isApplicant: true},
                    {isApplying: true}
                ]
            };
            nock(featureToggleUrl)
                .get(featureTogglePath)
                .reply(200, 'false');

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = [
                        'old_checklist1-item2',
                        'old_checklist2-item2',
                        'old_checklist3-item1-codicils',
                        'old_checklist3-item3',
                        'old_checklist3-item5-deedPoll',
                        'old_coverLetter-codicils',
                        'old_checklist3-item4-Form205',
                        'header',
                        'heading1',
                        'heading2',
                        'heading3',
                        'text1',
                        'text2',
                        'text3',
                        'text4',
                        'text5',
                        'text6',
                        'address',
                        'checklist1-item1-no-codicils',
                        'checklist1-item1-codicils',
                        'checklist1-item2',
                        'checklist2-item1',
                        'checklist2-item2',
                        'checklist2-item3-will-uploaded',
                        'checklist2-item4-iht205',
                        'checklist2-item5-renunciated',
                        'checklist2-item6-deed-poll',
                        'checkboxLabel-codicils'
                    ];
                    testWrapper.testContent(done, excludeKeys);
                });
        });
        it('test correct content loaded on the page, no codicils, no alias, multiple executors (Feature Toggle ON)', (done) => {
            sessionData.executors = {
                list: [
                    {isApplying: true, isApplicant: true},
                    {isApplying: true}
                ]
            };
            nock(featureToggleUrl)
                .get(featureTogglePath)
                .reply(200, 'true');

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = [
                        'old_header',
                        'old_printPage',
                        'old_heading2',
                        'old_checklist1Header',
                        'old_checklist1-item1',
                        'old_checklist1-item2',
                        'old_checklist2Header',
                        'old_checklist2-item1',
                        'old_checklist2-item2',
                        'old_checklist3HeaderNumber',
                        'old_checklist3HeaderNumberMultipleExecutors',
                        'old_checklist3Header',
                        'old_checklist3-item1',
                        'old_checklist3-item1-codicils',
                        'old_checklist3-item2',
                        'old_checklist3-item3',
                        'old_checklist3-item4-Form205',
                        'old_checklist3-item5-deedPoll',
                        'old_coverLetter',
                        'old_coverLetter-codicils',
                        'old_warning',
                        'old_heading3',
                        'old_sendDocuments',
                        'old_sendDocumentsAddress',
                        'checklist1-item1-codicils',
                        'checklist2-item3-will-uploaded',
                        'checklist2-item4-iht205',
                        'checklist2-item5-renunciated',
                        'checklist2-item6-deed-poll',
                        'checkboxLabel-codicils'
                    ];
                    testWrapper.testContent(done, excludeKeys);
                });
        });

        it('test correct content loaded on the page, no codicils, multiple executors, no alias, with optionRenunciated (Feature Toggle OFF)', (done) => {
            sessionData.executors = {
                executorsNumber: 2,
                list: [
                    {isApplying: true, isApplicant: true},
                    {notApplyingKey: 'optionRenunciated'}
                ]
            };
            nock(featureToggleUrl)
                .get(featureTogglePath)
                .reply(200, 'false');

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = [
                        'old_checklist1-item2',
                        'old_checklist2Header',
                        'old_checklist2-item1',
                        'old_checklist2-item2',
                        'old_checklist3-item1-codicils',
                        'old_checklist3-item5-deedPoll',
                        'old_coverLetter-codicils',
                        'old_checklist3-item4-Form205',
                        'header',
                        'heading1',
                        'heading2',
                        'heading3',
                        'text1',
                        'text2',
                        'text3',
                        'text4',
                        'text5',
                        'text6',
                        'address',
                        'checklist1-item1-no-codicils',
                        'checklist1-item1-codicils',
                        'checklist1-item2',
                        'checklist2-item1',
                        'checklist2-item2',
                        'checklist2-item3-will-uploaded',
                        'checklist2-item4-iht205',
                        'checklist2-item5-renunciated',
                        'checklist2-item6-deed-poll',
                        'checkboxLabel-codicils'
                    ];
                    const contentData = {
                        renunciationFormLink: config.links.renunciationForm
                    };
                    testWrapper.testContent(done, excludeKeys, contentData);
                });
        });
        it('test correct content loaded on the page, no codicils, multiple executors, no alias, with optionRenunciated (Feature Toggle ON)', (done) => {
            sessionData.executors = {
                executorsNumber: 2,
                list: [
                    {isApplying: true, isApplicant: true},
                    {notApplyingKey: 'optionRenunciated'}
                ]
            };
            nock(featureToggleUrl)
                .get(featureTogglePath)
                .reply(200, 'true');

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = [
                        'old_header',
                        'old_printPage',
                        'old_heading2',
                        'old_checklist1Header',
                        'old_checklist1-item1',
                        'old_checklist1-item2',
                        'old_checklist2Header',
                        'old_checklist2-item1',
                        'old_checklist2-item2',
                        'old_checklist3HeaderNumber',
                        'old_checklist3HeaderNumberMultipleExecutors',
                        'old_checklist3Header',
                        'old_checklist3-item1',
                        'old_checklist3-item1-codicils',
                        'old_checklist3-item2',
                        'old_checklist3-item3',
                        'old_checklist3-item4-Form205',
                        'old_checklist3-item5-deedPoll',
                        'old_coverLetter',
                        'old_coverLetter-codicils',
                        'old_warning',
                        'old_heading3',
                        'old_sendDocuments',
                        'old_sendDocumentsAddress',
                        'text6',
                        'checklist1-item1-codicils',
                        'checklist2-item3-will-uploaded',
                        'checklist2-item4-iht205',
                        'checklist2-item6-deed-poll',
                        'checkboxLabel-codicils'
                    ];
                    const contentData = {
                        renunciationFormLink: config.links.renunciationForm
                    };
                    testWrapper.testContent(done, excludeKeys, contentData);
                });
        });

        it('test correct content loaded on the page, has codicils, no alias, single executor (Feature Toggle OFF)', (done) => {
            sessionData.will = {
                codicilsNumber: '1'
            };
            sessionData.executors = {};
            nock(featureToggleUrl)
                .get(featureTogglePath)
                .reply(200, 'false');

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = [
                        'old_checklist2Header',
                        'old_checklist2-item1',
                        'old_checklist2-item2',
                        'old_checklist3-item1',
                        'old_checklist3-item3',
                        'old_checklist3-item5-deedPoll',
                        'old_coverLetter',
                        'old_checklist3-item4-Form205',
                        'header',
                        'heading1',
                        'heading2',
                        'heading3',
                        'text1',
                        'text2',
                        'text3',
                        'text4',
                        'text5',
                        'text6',
                        'address',
                        'checklist1-item1-no-codicils',
                        'checklist1-item1-codicils',
                        'checklist1-item2',
                        'checklist2-item1',
                        'checklist2-item2',
                        'checklist2-item3-will-uploaded',
                        'checklist2-item4-iht205',
                        'checklist2-item5-renunciated',
                        'checklist2-item6-deed-poll',
                        'checkboxLabel'
                    ];
                    const contentData = {
                        codicilsNumber: 1
                    };
                    testWrapper.testContent(done, excludeKeys, contentData);
                });
        });
        it('test correct content loaded on the page, has codicils, no alias, single executor (Feature Toggle ON)', (done) => {
            sessionData.will = {
                codicils: 'Yes',
                codicilsNumber: '1'
            };
            sessionData.executors = {};
            nock(featureToggleUrl)
                .get(featureTogglePath)
                .reply(200, 'true');

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = [
                        'old_header',
                        'old_printPage',
                        'old_heading2',
                        'old_checklist1Header',
                        'old_checklist1-item1',
                        'old_checklist1-item2',
                        'old_checklist2Header',
                        'old_checklist2-item1',
                        'old_checklist2-item2',
                        'old_checklist3HeaderNumber',
                        'old_checklist3HeaderNumberMultipleExecutors',
                        'old_checklist3Header',
                        'old_checklist3-item1',
                        'old_checklist3-item1-codicils',
                        'old_checklist3-item2',
                        'old_checklist3-item3',
                        'old_checklist3-item4-Form205',
                        'old_checklist3-item5-deedPoll',
                        'old_coverLetter',
                        'old_coverLetter-codicils',
                        'old_warning',
                        'old_heading3',
                        'old_sendDocuments',
                        'old_sendDocumentsAddress',
                        'text6',
                        'checklist1-item1-no-codicils',
                        'checklist2-item3-will-uploaded',
                        'checklist2-item4-iht205',
                        'checklist2-item5-renunciated',
                        'checklist2-item6-deed-poll',
                        'checkboxLabel'
                    ];
                    const contentData = {
                        codicilsNumber: 1
                    };
                    testWrapper.testContent(done, excludeKeys, contentData);
                });
        });

        it('test correct content loaded on the page, has codicils, no alias, multiple executors (Feature Toggle OFF)', (done) => {
            sessionData.will = {
                codicilsNumber: '1'
            };
            sessionData.executors = {
                list: [
                    {isApplying: true, isApplicant: true},
                    {isApplying: true}
                ]
            };
            nock(featureToggleUrl)
                .get(featureTogglePath)
                .reply(200, 'false');

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = [
                        'old_checklist3-item1',
                        'old_checklist3-item3',
                        'old_coverLetter',
                        'old_checkboxLabel',
                        'old_checklist3-item4-Form205',
                        'old_checklist3-item5-deedPoll',
                        'header',
                        'heading1',
                        'heading2',
                        'heading3',
                        'text1',
                        'text2',
                        'text3',
                        'text4',
                        'text5',
                        'text6',
                        'address',
                        'checklist1-item1-no-codicils',
                        'checklist1-item1-codicils',
                        'checklist1-item2',
                        'checklist2-item1',
                        'checklist2-item2',
                        'checklist2-item3-will-uploaded',
                        'checklist2-item4-iht205',
                        'checklist2-item5-renunciated',
                        'checklist2-item6-deed-poll',
                        'checkboxLabel'
                    ];
                    const contentData = {
                        codicilsNumber: 1
                    };
                    testWrapper.testContent(done, excludeKeys, contentData);
                });
        });
        it('test correct content loaded on the page, has codicils, no alias, multiple executors (Feature Toggle ON)', (done) => {
            sessionData.will = {
                codicils: 'Yes',
                codicilsNumber: '1'
            };
            sessionData.executors = {
                list: [
                    {isApplying: true, isApplicant: true},
                    {isApplying: true}
                ]
            };
            nock(featureToggleUrl)
                .get(featureTogglePath)
                .reply(200, 'true');

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = [
                        'old_header',
                        'old_printPage',
                        'old_heading2',
                        'old_checklist1Header',
                        'old_checklist1-item1',
                        'old_checklist1-item2',
                        'old_checklist2Header',
                        'old_checklist2-item1',
                        'old_checklist2-item2',
                        'old_checklist3HeaderNumber',
                        'old_checklist3HeaderNumberMultipleExecutors',
                        'old_checklist3Header',
                        'old_checklist3-item1',
                        'old_checklist3-item1-codicils',
                        'old_checklist3-item2',
                        'old_checklist3-item3',
                        'old_checklist3-item4-Form205',
                        'old_checklist3-item5-deedPoll',
                        'old_coverLetter',
                        'old_coverLetter-codicils',
                        'old_warning',
                        'old_heading3',
                        'old_sendDocuments',
                        'old_sendDocumentsAddress',
                        'checklist1-item1-no-codicils',
                        'checklist2-item3-will-uploaded',
                        'checklist2-item4-iht205',
                        'checklist2-item5-renunciated',
                        'checklist2-item6-deed-poll',
                        'checkboxLabel'
                    ];
                    const contentData = {
                        codicilsNumber: 1
                    };
                    testWrapper.testContent(done, excludeKeys, contentData);
                });
        });

        it('test correct content loaded on the page, no codicils, single executor, no alias, specified registry address (Feature Toggle OFF)', (done) => {
            sessionData.executors = {};
            sessionData.registry = {
                address: '1 Red Street\nLondon\nO1 1OL'
            };
            nock(featureToggleUrl)
                .get(featureTogglePath)
                .reply(200, 'false');

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = [
                        'old_checklist1-item2',
                        'old_checklist2Header',
                        'old_checklist2-item1',
                        'old_checklist2-item2',
                        'old_checklist3-item1-codicils',
                        'old_checklist3-item3',
                        'old_checklist3-item5-deedPoll',
                        'old_coverLetter-codicils',
                        'old_sendDocumentsAddress',
                        'old_checklist3-item4-Form205',
                        'header',
                        'heading1',
                        'heading2',
                        'heading3',
                        'text1',
                        'text2',
                        'text3',
                        'text4',
                        'text5',
                        'text6',
                        'address',
                        'checklist1-item1-no-codicils',
                        'checklist1-item1-codicils',
                        'checklist1-item2',
                        'checklist2-item1',
                        'checklist2-item2',
                        'checklist2-item3-will-uploaded',
                        'checklist2-item4-iht205',
                        'checklist2-item5-renunciated',
                        'checklist2-item6-deed-poll',
                        'checkboxLabel-codicils'
                    ];
                    testWrapper.testContent(done, excludeKeys);
                });
        });
        it('test correct content loaded on the page, no codicils, single executor, no alias, specified registry address (Feature Toggle ON)', (done) => {
            sessionData.executors = {};
            sessionData.registry = {
                address: '1 Red Street\nLondon\nO1 1OL'
            };
            nock(featureToggleUrl)
                .get(featureTogglePath)
                .reply(200, 'true');

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = [
                        'old_header',
                        'old_printPage',
                        'old_heading2',
                        'old_checklist1Header',
                        'old_checklist1-item1',
                        'old_checklist1-item2',
                        'old_checklist2Header',
                        'old_checklist2-item1',
                        'old_checklist2-item2',
                        'old_checklist3HeaderNumber',
                        'old_checklist3HeaderNumberMultipleExecutors',
                        'old_checklist3Header',
                        'old_checklist3-item1',
                        'old_checklist3-item1-codicils',
                        'old_checklist3-item2',
                        'old_checklist3-item3',
                        'old_checklist3-item4-Form205',
                        'old_checklist3-item5-deedPoll',
                        'old_coverLetter',
                        'old_coverLetter-codicils',
                        'old_warning',
                        'old_heading3',
                        'old_sendDocuments',
                        'old_sendDocumentsAddress',
                        'text6',
                        'checklist1-item1-codicils',
                        'checklist2-item3-will-uploaded',
                        'checklist2-item4-iht205',
                        'checklist2-item5-renunciated',
                        'checklist2-item6-deed-poll',
                        'checkboxLabel-codicils'
                    ];
                    testWrapper.testContent(done, excludeKeys);
                });
        });

        it('test correct content loaded on the page, no codicils, single executor, no alias, online IHT (Feature Toggle OFF)', (done) => {
            sessionData.executors = {};
            sessionData.iht = {
                method: ihtContent.onlineOption
            };
            nock(featureToggleUrl)
                .get(featureTogglePath)
                .reply(200, 'false');

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = [
                        'old_checklist1-item2',
                        'old_checklist2Header',
                        'old_checklist2-item1',
                        'old_checklist2-item2',
                        'old_checklist3-item1-codicils',
                        'old_checklist3-item3',
                        'old_checklist3-item5-deedPoll',
                        'old_coverLetter-codicils',
                        'old_checklist3-item4-Form205',
                        'header',
                        'heading1',
                        'heading2',
                        'heading3',
                        'text1',
                        'text2',
                        'text3',
                        'text4',
                        'text5',
                        'text6',
                        'address',
                        'checklist1-item1-no-codicils',
                        'checklist1-item1-codicils',
                        'checklist1-item2',
                        'checklist2-item1',
                        'checklist2-item2',
                        'checklist2-item3-will-uploaded',
                        'checklist2-item4-iht205',
                        'checklist2-item5-renunciated',
                        'checklist2-item6-deed-poll',
                        'checkboxLabel-codicils'
                    ];
                    testWrapper.testContent(done, excludeKeys);
                });
        });
        it('test correct content loaded on the page, no codicils, single executor, no alias, online IHT (Feature Toggle ON)', (done) => {
            sessionData.executors = {};
            sessionData.iht = {
                method: ihtContent.onlineOption
            };
            nock(featureToggleUrl)
                .get(featureTogglePath)
                .reply(200, 'true');

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = [
                        'old_header',
                        'old_printPage',
                        'old_heading2',
                        'old_checklist1Header',
                        'old_checklist1-item1',
                        'old_checklist1-item2',
                        'old_checklist2Header',
                        'old_checklist2-item1',
                        'old_checklist2-item2',
                        'old_checklist3HeaderNumber',
                        'old_checklist3HeaderNumberMultipleExecutors',
                        'old_checklist3Header',
                        'old_checklist3-item1',
                        'old_checklist3-item1-codicils',
                        'old_checklist3-item2',
                        'old_checklist3-item3',
                        'old_checklist3-item4-Form205',
                        'old_checklist3-item5-deedPoll',
                        'old_coverLetter',
                        'old_coverLetter-codicils',
                        'old_warning',
                        'old_heading3',
                        'old_sendDocuments',
                        'old_sendDocumentsAddress',
                        'text6',
                        'checklist1-item1-codicils',
                        'checklist2-item3-will-uploaded',
                        'checklist2-item4-iht205',
                        'checklist2-item5-renunciated',
                        'checklist2-item6-deed-poll',
                        'checkboxLabel-codicils'
                    ];
                    testWrapper.testContent(done, excludeKeys);
                });
        });

        it('test correct content loaded on the page, no codicils, single executor, no alias, paper IHT, 207 or 400 (Feature Toggle OFF)', (done) => {
            sessionData.executors = {};
            sessionData.iht = {
                method: ihtContent.paperOption,
                form: 'IHT207'
            };
            nock(featureToggleUrl)
                .get(featureTogglePath)
                .reply(200, 'false');

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = [
                        'old_checklist1-item2',
                        'old_checklist2Header',
                        'old_checklist2-item1',
                        'old_checklist2-item2',
                        'old_checklist3-item1-codicils',
                        'old_checklist3-item3',
                        'old_checklist3-item5-deedPoll',
                        'old_coverLetter-codicils',
                        'old_checklist3-item4-Form205',
                        'header',
                        'heading1',
                        'heading2',
                        'heading3',
                        'text1',
                        'text2',
                        'text3',
                        'text4',
                        'text5',
                        'text6',
                        'address',
                        'checklist1-item1-no-codicils',
                        'checklist1-item1-codicils',
                        'checklist1-item2',
                        'checklist2-item1',
                        'checklist2-item2',
                        'checklist2-item3-will-uploaded',
                        'checklist2-item4-iht205',
                        'checklist2-item5-renunciated',
                        'checklist2-item6-deed-poll',
                        'checkboxLabel-codicils'
                    ];
                    testWrapper.testContent(done, excludeKeys);
                });
        });
        it('test correct content loaded on the page, no codicils, single executor, no alias, paper IHT, 207 or 400 (Feature Toggle ON)', (done) => {
            sessionData.executors = {};
            sessionData.iht = {
                method: ihtContent.paperOption,
                form: 'IHT207'
            };
            nock(featureToggleUrl)
                .get(featureTogglePath)
                .reply(200, 'true');

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = [
                        'old_header',
                        'old_printPage',
                        'old_heading2',
                        'old_checklist1Header',
                        'old_checklist1-item1',
                        'old_checklist1-item2',
                        'old_checklist2Header',
                        'old_checklist2-item1',
                        'old_checklist2-item2',
                        'old_checklist3HeaderNumber',
                        'old_checklist3HeaderNumberMultipleExecutors',
                        'old_checklist3Header',
                        'old_checklist3-item1',
                        'old_checklist3-item1-codicils',
                        'old_checklist3-item2',
                        'old_checklist3-item3',
                        'old_checklist3-item4-Form205',
                        'old_checklist3-item5-deedPoll',
                        'old_coverLetter',
                        'old_coverLetter-codicils',
                        'old_warning',
                        'old_heading3',
                        'old_sendDocuments',
                        'old_sendDocumentsAddress',
                        'text6',
                        'checklist1-item1-codicils',
                        'checklist2-item3-will-uploaded',
                        'checklist2-item4-iht205',
                        'checklist2-item5-renunciated',
                        'checklist2-item6-deed-poll',
                        'checkboxLabel-codicils'
                    ];
                    testWrapper.testContent(done, excludeKeys);
                });
        });

        it('test correct content loaded on the page, no codicils, single executor, no alias, paper IHT, 205 (Feature Toggle OFF)', (done) => {
            sessionData.executors = {};
            sessionData.iht = {
                method: ihtContent.paperOption,
                form: 'IHT205'
            };
            nock(featureToggleUrl)
                .get(featureTogglePath)
                .reply(200, 'false');

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = [
                        'old_checklist1-item2',
                        'old_checklist2Header',
                        'old_checklist2-item1',
                        'old_checklist2-item2',
                        'old_checklist3-item1-codicils',
                        'old_checklist3-item3',
                        'old_checklist3-item5-deedPoll',
                        'old_coverLetter-codicils',
                        'header',
                        'heading1',
                        'heading2',
                        'heading3',
                        'text1',
                        'text2',
                        'text3',
                        'text4',
                        'text5',
                        'text6',
                        'address',
                        'checklist1-item1-no-codicils',
                        'checklist1-item1-codicils',
                        'checklist1-item2',
                        'checklist2-item1',
                        'checklist2-item2',
                        'checklist2-item3-will-uploaded',
                        'checklist2-item4-iht205',
                        'checklist2-item5-renunciated',
                        'checklist2-item6-deed-poll',
                        'checkboxLabel-codicils'
                    ];
                    testWrapper.testContent(done, excludeKeys);
                });
        });
        it('test correct content loaded on the page, no codicils, single executor, no alias, paper IHT, 205 (Feature Toggle ON)', (done) => {
            sessionData.executors = {};
            sessionData.iht = {
                method: ihtContent.paperOption,
                form: 'IHT205'
            };
            nock(featureToggleUrl)
                .get(featureTogglePath)
                .reply(200, 'true');

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = [
                        'old_header',
                        'old_printPage',
                        'old_heading2',
                        'old_checklist1Header',
                        'old_checklist1-item1',
                        'old_checklist1-item2',
                        'old_checklist2Header',
                        'old_checklist2-item1',
                        'old_checklist2-item2',
                        'old_checklist3HeaderNumber',
                        'old_checklist3HeaderNumberMultipleExecutors',
                        'old_checklist3Header',
                        'old_checklist3-item1',
                        'old_checklist3-item1-codicils',
                        'old_checklist3-item2',
                        'old_checklist3-item3',
                        'old_checklist3-item4-Form205',
                        'old_checklist3-item5-deedPoll',
                        'old_coverLetter',
                        'old_coverLetter-codicils',
                        'old_warning',
                        'old_heading3',
                        'old_sendDocuments',
                        'old_sendDocumentsAddress',
                        'text6',
                        'checklist1-item1-codicils',
                        'checklist2-item3-will-uploaded',
                        'checklist2-item5-renunciated',
                        'checklist2-item6-deed-poll',
                        'checkboxLabel-codicils'
                    ];
                    testWrapper.testContent(done, excludeKeys);
                });
        });

        it('test correct content loaded on the page, only one executor name changed by deed poll (Feature Toggle OFF)', (done) => {
            sessionData.executors = {
                list: [
                    {firstName: 'james', lastName: 'miller', isApplying: true, isApplicant: true, alias: 'jimbo fisher', aliasReason: 'Marriage'},
                    {fullName: 'ed brown', isApplying: true, currentName: 'eddie jones', currentNameReason: 'Change by deed poll'},
                    {fullName: 'bob brown', isApplying: true, currentName: 'bobbie houston', currentNameReason: 'Divorce'}
                ]
            };
            const contentData = {executorCurrentName: 'eddie jones'};
            nock(featureToggleUrl)
                .get(featureTogglePath)
                .reply(200, 'false');

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = [
                        'old_checklist1-item2',
                        'old_checklist2Header',
                        'old_checklist2-item1',
                        'old_checklist2-item2',
                        'old_checklist3-item1-codicils',
                        'old_checklist3-item3',
                        'old_coverLetter-codicils',
                        'old_checklist3-item4-Form205',
                        'header',
                        'heading1',
                        'heading2',
                        'heading3',
                        'text1',
                        'text2',
                        'text3',
                        'text4',
                        'text5',
                        'text6',
                        'address',
                        'checklist1-item1-no-codicils',
                        'checklist1-item1-codicils',
                        'checklist1-item2',
                        'checklist2-item1',
                        'checklist2-item2',
                        'checklist2-item3-will-uploaded',
                        'checklist2-item4-iht205',
                        'checklist2-item5-renunciated',
                        'checklist2-item6-deed-poll',
                        'checkboxLabel-codicils'
                    ];
                    testWrapper.testContent(done, excludeKeys, contentData);
                });
        });
        it('test correct content loaded on the page, only one executor name changed by deed poll (Feature Toggle ON)', (done) => {
            sessionData.executors = {
                list: [
                    {firstName: 'james', lastName: 'miller', isApplying: true, isApplicant: true, alias: 'jimbo fisher', aliasReason: 'Marriage'},
                    {fullName: 'ed brown', isApplying: true, currentName: 'eddie jones', currentNameReason: 'Change by deed poll'},
                    {fullName: 'bob brown', isApplying: true, currentName: 'bobbie houston', currentNameReason: 'Divorce'}
                ]
            };
            const contentData = {executorCurrentName: 'eddie jones'};
            nock(featureToggleUrl)
                .get(featureTogglePath)
                .reply(200, 'true');

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = [
                        'old_header',
                        'old_printPage',
                        'old_heading2',
                        'old_checklist1Header',
                        'old_checklist1-item1',
                        'old_checklist1-item2',
                        'old_checklist2Header',
                        'old_checklist2-item1',
                        'old_checklist2-item2',
                        'old_checklist3HeaderNumber',
                        'old_checklist3HeaderNumberMultipleExecutors',
                        'old_checklist3Header',
                        'old_checklist3-item1',
                        'old_checklist3-item1-codicils',
                        'old_checklist3-item2',
                        'old_checklist3-item3',
                        'old_checklist3-item4-Form205',
                        'old_checklist3-item5-deedPoll',
                        'old_coverLetter',
                        'old_coverLetter-codicils',
                        'old_warning',
                        'old_heading3',
                        'old_sendDocuments',
                        'old_sendDocumentsAddress',
                        'checklist1-item1-codicils',
                        'checklist2-item3-will-uploaded',
                        'checklist2-item4-iht205',
                        'checklist2-item5-renunciated',
                        'checkboxLabel-codicils'
                    ];
                    testWrapper.testContent(done, excludeKeys, contentData);
                });
        });

        it('test correct content loaded on the page, multiple executor name changed by deed poll (Feature Toggle OFF)', (done) => {
            sessionData.executors = {
                list: [
                    {firstName: 'james', lastName: 'miller', isApplying: true, isApplicant: true, alias: 'jimbo fisher', aliasReason: 'Change by deed poll'},
                    {fullName: 'ed brown', isApplying: true, currentName: 'eddie jones', currentNameReason: 'Change by deed poll'},
                    {fullName: 'bob brown', isApplying: true, currentName: 'bobbie houston', currentNameReason: 'other', otherReason: 'Did not like my name'}
                ]
            };
            const contentData = {
                executorCurrentName: [
                    'jimbo fisher',
                    'eddie jones'
                ]
            };
            nock(featureToggleUrl)
                .get(featureTogglePath)
                .reply(200, 'false');

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = [
                        'old_checklist1-item2',
                        'old_checklist2Header',
                        'old_checklist2-item1',
                        'old_checklist2-item2',
                        'old_checklist3-item1-codicils',
                        'old_checklist3-item3',
                        'old_coverLetter-codicils',
                        'old_checklist3-item4-Form205',
                        'header',
                        'heading1',
                        'heading2',
                        'heading3',
                        'text1',
                        'text2',
                        'text3',
                        'text4',
                        'text5',
                        'text6',
                        'address',
                        'checklist1-item1-no-codicils',
                        'checklist1-item1-codicils',
                        'checklist1-item2',
                        'checklist2-item1',
                        'checklist2-item2',
                        'checklist2-item3-will-uploaded',
                        'checklist2-item4-iht205',
                        'checklist2-item5-renunciated',
                        'checklist2-item6-deed-poll',
                        'checkboxLabel-codicils'
                    ];
                    testWrapper.testContent(done, excludeKeys, contentData);
                });
        });
        it('test correct content loaded on the page, multiple executor name changed by deed poll (Feature Toggle ON)', (done) => {
            sessionData.executors = {
                list: [
                    {firstName: 'james', lastName: 'miller', isApplying: true, isApplicant: true, alias: 'jimbo fisher', aliasReason: 'Change by deed poll'},
                    {fullName: 'ed brown', isApplying: true, currentName: 'eddie jones', currentNameReason: 'Change by deed poll'},
                    {fullName: 'bob brown', isApplying: true, currentName: 'bobbie houston', currentNameReason: 'other', otherReason: 'Did not like my name'}
                ]
            };
            const contentData = {
                executorCurrentName: [
                    'jimbo fisher',
                    'eddie jones'
                ]
            };
            nock(featureToggleUrl)
                .get(featureTogglePath)
                .reply(200, 'true');

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = [
                        'old_header',
                        'old_printPage',
                        'old_heading2',
                        'old_checklist1Header',
                        'old_checklist1-item1',
                        'old_checklist1-item2',
                        'old_checklist2Header',
                        'old_checklist2-item1',
                        'old_checklist2-item2',
                        'old_checklist3HeaderNumber',
                        'old_checklist3HeaderNumberMultipleExecutors',
                        'old_checklist3Header',
                        'old_checklist3-item1',
                        'old_checklist3-item1-codicils',
                        'old_checklist3-item2',
                        'old_checklist3-item3',
                        'old_checklist3-item4-Form205',
                        'old_checklist3-item5-deedPoll',
                        'old_coverLetter',
                        'old_coverLetter-codicils',
                        'old_warning',
                        'old_heading3',
                        'old_sendDocuments',
                        'old_sendDocumentsAddress',
                        'checklist1-item1-codicils',
                        'checklist2-item3-will-uploaded',
                        'checklist2-item4-iht205',
                        'checklist2-item5-renunciated',
                        'checkboxLabel-codicils'
                    ];
                    testWrapper.testContent(done, excludeKeys, contentData);
                });
        });

        it('test correct content loaded on the page, original will uploaded (Feature Toggle ON)', (done) => {
            sessionData.documents = {
                uploads: [
                    {
                        filename: 'death-certificate.pdf',
                        url: 'http://localhost:8383/documents/60e34ae2-8816-48a6-8b74-a1a3639cd505'
                    }
                ]
            };
            nock(featureToggleUrl)
                .get(featureTogglePath)
                .reply(200, 'true');

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = [
                        'old_header',
                        'old_printPage',
                        'old_heading2',
                        'old_checklist1Header',
                        'old_checklist1-item1',
                        'old_checklist1-item2',
                        'old_checklist2Header',
                        'old_checklist2-item1',
                        'old_checklist2-item2',
                        'old_checklist3HeaderNumber',
                        'old_checklist3HeaderNumberMultipleExecutors',
                        'old_checklist3Header',
                        'old_checklist3-item1',
                        'old_checklist3-item1-codicils',
                        'old_checklist3-item2',
                        'old_checklist3-item3',
                        'old_checklist3-item4-Form205',
                        'old_checklist3-item5-deedPoll',
                        'old_coverLetter',
                        'old_coverLetter-codicils',
                        'old_warning',
                        'old_heading3',
                        'old_sendDocuments',
                        'old_sendDocumentsAddress',
                        'text6',
                        'checklist1-item1-codicils',
                        'checklist2-item4-iht205',
                        'checklist2-item5-renunciated',
                        'checklist2-item6-deed-poll',
                        'checkboxLabel-codicils'
                    ];
                    testWrapper.testContent(done, excludeKeys);
                });
        });

        it('test correct content loaded on the page, CCD Case ID not present (Feature Toggle ON)', (done) => {
            delete sessionData.ccdCase;

            nock(featureToggleUrl)
                .get(featureTogglePath)
                .reply(200, 'true');

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    const excludeKeys = [
                        'old_header',
                        'old_printPage',
                        'old_heading2',
                        'old_checklist1Header',
                        'old_checklist1-item1',
                        'old_checklist1-item2',
                        'old_checklist2Header',
                        'old_checklist2-item1',
                        'old_checklist2-item2',
                        'old_checklist3HeaderNumber',
                        'old_checklist3HeaderNumberMultipleExecutors',
                        'old_checklist3Header',
                        'old_checklist3-item1',
                        'old_checklist3-item1-codicils',
                        'old_checklist3-item2',
                        'old_checklist3-item3',
                        'old_checklist3-item4-Form205',
                        'old_checklist3-item5-deedPoll',
                        'old_coverLetter',
                        'old_coverLetter-codicils',
                        'old_warning',
                        'old_heading3',
                        'old_sendDocuments',
                        'old_sendDocumentsAddress',
                        'text2',
                        'text6',
                        'checklist1-item1-codicils',
                        'checklist2-item3-will-uploaded',
                        'checklist2-item4-iht205',
                        'checklist2-item5-renunciated',
                        'checklist2-item6-deed-poll',
                        'checkboxLabel-codicils'
                    ];
                    testWrapper.testContent(done, excludeKeys);
                });
        });

        it('test errors message displayed for missing data', (done) => {
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testErrors(done, {}, 'required', ['sentDocuments']);
                });
        });

        it(`test it redirects to next page: ${expectedNextUrlForThankYouPage}`, (done) => {
            const data = {
                sentDocuments: true
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end(() => {
                    testWrapper.testRedirect(done, data, expectedNextUrlForThankYouPage);
                });
        });
    });
});
