'use strict';

const requireDir = require('require-directory');
const TestWrapper = require('test/util/TestWrapper');
const willContent = requireDir(module, '../../../app/resources/en/translation/will');
const willContentWelsh = requireDir(module, '../../../app/resources/cy/translation/will');

describe('summary-codicils-section', () => {
    let testWrapper, sessionData;

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test correct content loaded on the codicils section of the summary page, when no data is entered - FT ON', (done) => {
            testWrapper = new TestWrapper('Summary', {ft_will_condition: true});
            sessionData = require('test/data/will/codicils-noDamage');
            sessionData.ccdCase = {
                state: 'Pending',
                id: 1234567890123456
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    const playbackData = {
                        codicilsHasVisibleDamage: willContent.codicils.question
                    };

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test correct content loaded on the codicils section of the summary page, when no data is entered - FT OFF', (done) => {
            testWrapper = new TestWrapper('Summary', {ft_will_condition: false});
            sessionData = require('test/data/will/codicils-noDamage');
            sessionData.ccdCase = {
                state: 'Pending',
                id: 1234567890123456
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    const playbackData = {
                        codicils: willContent.codicils.question
                    };

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });
        it('test correct content and data loaded on the codicils section of the summary page, when section is complete - FT ON', (done) => {
            testWrapper = new TestWrapper('Summary', {ft_will_condition: true});
            sessionData = require('test/data/will/codicils');
            sessionData.ccdCase = {
                state: 'Pending',
                id: 1234567890123456
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    delete require.cache[require.resolve('test/data/will/codicils')];
                    const playbackData = {
                        otherDamageDescriptionHint: willContent.codicilshasvisibledamage.otherDamageDescriptionHint,
                        otherDamage: willContent.codicilshasvisibledamage.otherDamage,
                        selectedDamage1: willContent.codicilshasvisibledamage.optionstapleOrPunchHoles,
                        selectedDamage2: willContent.codicilshasvisibledamage.optionotherVisibleDamage,
                        codicilsHasVisibleDamage: willContent.codicilshasvisibledamage.question,
                        codicilsDamageReasonKnown: willContent.codicilsdamagereasonknown.question,
                        codicilsDamageReasonDescriptionTitle: willContent.codicilsdamagereasonknown.codicilsDamageReasonDescriptionTitle,
                        codicilsDamageDateKnown: willContent.codicilsdamagedate.question,
                        codicilsDamageDate: willContent.codicilsdamagedate.date,
                        culpritQuestion: willContent.codicilsdamageculpritknown.question,
                        culpritFirstName: willContent.codicilsdamageculpritknown.firstName,
                        culpritLastName: willContent.codicilsdamageculpritknown.lastName,
                        writtentWishes: willContent.deceasedwrittenwishes.question
                    };

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });
        it('test correct content and data loaded on the codicils section of the summary page, when section is complete WELSH - FT ON', (done) => {
            testWrapper = new TestWrapper('Summary', {ft_will_condition: true});
            sessionData = require('test/data/will/codicils');
            sessionData.ccdCase = {
                state: 'Pending',
                id: 1234567890123456
            };

            sessionData.language = 'cy';
            const contentToExclude = ['title', 'heading', 'checkCarefully', 'uploadedDocumentsHeading', 'uploadedDocumentsEmpty', 'applicantHeading', 'deceasedHeading', 'ihtHeading', 'otherExecutors', 'executorsWhenDiedQuestion', 'otherNamesLabel', 'aboutPeopleApplyingHeading', 'aboutYouHeading', 'executorApplyingForProbate', 'executorsNotApplyingForProbate', 'executorsWithOtherNames', 'nameOnWill', 'currentName', 'currentNameReason', 'address', 'mobileNumber', 'emailAddress', 'checkAnswersPdf', 'willConditionHeading', 'codicilsConditionHeading'];
            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    delete require.cache[require.resolve('test/data/will/codicils')];
                    const playbackData = {
                        otherDamageDescriptionHint: willContentWelsh.codicilshasvisibledamage.otherDamageDescriptionHint,
                        otherDamage: willContentWelsh.codicilshasvisibledamage.otherDamage,
                        selectedDamage1: willContentWelsh.codicilshasvisibledamage.optionstapleOrPunchHoles,
                        selectedDamage2: willContentWelsh.codicilshasvisibledamage.optionotherVisibleDamage,
                        codicilsHasVisibleDamage: willContentWelsh.codicilshasvisibledamage.question,
                        codicilsDamageReasonKnown: willContentWelsh.codicilsdamagereasonknown.question,
                        codicilsDamageReasonDescriptionTitle: willContentWelsh.codicilsdamagereasonknown.codicilsDamageReasonDescriptionTitle,
                        codicilsDamageDateKnown: willContentWelsh.codicilsdamagedate.question,
                        codicilsDamageDate: willContentWelsh.codicilsdamagedate.date,
                        culpritQuestion: willContentWelsh.codicilsdamageculpritknown.question,
                        culpritFirstName: willContentWelsh.codicilsdamageculpritknown.firstName,
                        culpritLastName: willContentWelsh.codicilsdamageculpritknown.lastName,
                        writtentWishes: willContentWelsh.deceasedwrittenwishes.question
                    };

                    testWrapper.testContent(done, playbackData, contentToExclude, [], 'cy');
                });
        });
        it('test correct content and data loaded on the codicils section of the summary page, when section is complete - FT OFF', (done) => {
            testWrapper = new TestWrapper('Summary', {ft_will_condition: false});
            sessionData = require('test/data/will/codicils');
            sessionData.ccdCase = {
                state: 'Pending',
                id: 1234567890123456
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    delete require.cache[require.resolve('test/data/will/codicils')];
                    const playbackData = {
                        codicilsHasVisibleDamage: willContent.codicils.question
                    };

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });
    });
});
