'use strict';

const requireDir = require('require-directory');
const TestWrapper = require('test/util/TestWrapper');
const {expect} = require('chai');
const languageContent = require('../../../app/resources/en/translation/language');
const deceasedContent = requireDir(module, '../../../app/resources/en/translation/deceased');
const willContent = requireDir(module, '../../../app/resources/en/translation/will');
const FormatName = require('app/utils/FormatName');

describe('summary-deceased-section', () => {
    let testWrapper, sessionData;

    beforeEach(() => {
        testWrapper = new TestWrapper('Summary');
        sessionData = require('test/data/deceased_new_death_cert_flow');
    });

    afterEach(() => {
        testWrapper.destroy();
    });

    describe('Verify Content, Errors and Redirection', () => {
        it('test correct content loaded on the deceased section of the summary page, when no data is entered', (done) => {
            sessionData = {
                ccdCase: {
                    state: 'Pending',
                    id: 1234567890123456
                }
            };

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }
                    const playbackData = {
                        bilingual: languageContent.question,
                        firstName: deceasedContent.name.firstName,
                        lastName: deceasedContent.name.lastName,
                        alias: deceasedContent.alias.question.replace('{deceasedName}', deceasedContent.alias.theDeceased),
                        questionMaritalStatus: deceasedContent.maritalstatus.question.replace('{deceasedName}', deceasedContent.alias.theDeceased),
                        dob: deceasedContent.dob.question,
                        dod: deceasedContent.dod.question,
                        address: deceasedContent.address.question.replace('{deceasedName}', deceasedContent.alias.theDeceased),
                        willCodicils: willContent.codicils.question
                    };

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test correct content loaded on the deceased section of the summary page, when section is complete', (done) => {
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
                    delete require.cache[require.resolve('test/data/deceased_new_death_cert_flow')];
                    const deceasedName = FormatName.format(sessionData.deceased);
                    const playbackData = {
                        bilingual: languageContent.question,
                        firstName: deceasedContent.name.firstName,
                        lastName: deceasedContent.name.lastName,
                        alias: deceasedContent.alias.question.replace('{deceasedName}', deceasedName),
                        maritalStatus: deceasedContent.maritalstatus.question.replace('{deceasedName}', deceasedName),
                        married: deceasedContent.married.question.replace('{deceasedName}', deceasedName),
                        dob: deceasedContent.dob.question,
                        dod: deceasedContent.dod.question,
                        address: deceasedContent.address.question.replace('{deceasedName}', deceasedName),
                        willCodicils: willContent.codicils.question
                    };

                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('test data is played back correctly on the deceased section of the summary page', (done) => {
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
                    delete require.cache[require.resolve('test/data/deceased_new_death_cert_flow')];
                    const deceasedName = FormatName.format(sessionData.deceased);
                    const playbackData = {
                        questionBilingual: languageContent.question,
                        questionFirstName: deceasedContent.name.firstName,
                        questionLastName: deceasedContent.name.lastName,
                        questionAlias: deceasedContent.alias.question.replace('{deceasedName}', deceasedName),
                        questionMaritalStatus: deceasedContent.maritalstatus.question.replace('{deceasedName}', deceasedName),
                        questionMarried: deceasedContent.married.question.replace('{deceasedName}', deceasedName),
                        questionDeceasedPartnerName: deceasedContent.deceasedpartnername.question.replace('{deceasedName}', deceasedName),
                        questionDob: deceasedContent.dob.question,
                        questionDod: deceasedContent.dod.question,
                        questionAddress: deceasedContent.address.question.replace('{deceasedName}', deceasedName),
                        questionWillCodicils: willContent.codicils.question,
                        questionDiedEngOrWales: deceasedContent.diedengorwales.question.replace('{deceasedName}', deceasedName),
                        questionDeathCertificate: deceasedContent.deathcertificate.question
                    };
                    Object.assign(playbackData, sessionData.deceased);
                    playbackData.alias = deceasedContent.alias[playbackData.alias];
                    playbackData.maritalStatus = deceasedContent.maritalstatus[playbackData.maritalStatus];
                    playbackData.married = deceasedContent.married[playbackData.married];
                    playbackData.domicile = deceasedContent.married[playbackData.domicile];
                    playbackData.diedEngOrWales = deceasedContent.diedengorwales[playbackData.diedEngOrWales];
                    playbackData.deathCertificate = deceasedContent.deathcertificate[playbackData.deathCertificate];
                    playbackData.address = sessionData.deceased.address.formattedAddress;
                    testWrapper.testDataPlayback(done, playbackData);
                });
        });

        it('shows widowed marital questions in the expected order under alias on CYA', (done) => {
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

                    const deceasedName = FormatName.format(sessionData.deceased);
                    const questionsInOrder = [
                        deceasedContent.alias.question.replace('{deceasedName}', deceasedName),
                        deceasedContent.maritalstatus.question.replace('{deceasedName}', deceasedName),
                        deceasedContent.deceasedpartnername.question.replace('{deceasedName}', deceasedName),
                        deceasedContent.married.question.replace('{deceasedName}', deceasedName)
                    ];

                    testWrapper.agent.get(testWrapper.pageUrl)
                        .expect('Content-type', /html/)
                        .then((response) => {
                            let previousPosition = -1;
                            questionsInOrder.forEach((questionText) => {
                                const currentPosition = response.text.toLowerCase().indexOf(questionText.toLowerCase());
                                expect(currentPosition, `Expected to find question: ${questionText}`).to.be.greaterThan(-1);
                                expect(currentPosition, `Question out of order: ${questionText}`).to.be.greaterThan(previousPosition);
                                previousPosition = currentPosition;
                            });
                            done();
                        })
                        .catch((requestErr) => done(requestErr));
                });
        });

        it('shows divorced marital questions in the expected order under alias on CYA', (done) => {
            sessionData.ccdCase = {
                state: 'Pending',
                id: 1234567890123456
            };
            sessionData.deceased.maritalStatus = 'optionDivorced';
            sessionData.deceased.divorcePlace = 'optionYes';
            sessionData.deceased.divorceDateKnown = 'optionYes';
            sessionData.deceased.divorceDate = '2010-01-10';
            delete sessionData.deceased.deceasedSpouseName;

            testWrapper.agent.post('/prepare-session/form')
                .send(sessionData)
                .end((err) => {
                    if (err) {
                        throw err;
                    }

                    const deceasedName = FormatName.format(sessionData.deceased);
                    const questionsInOrder = [
                        deceasedContent.alias.question.replace('{deceasedName}', deceasedName),
                        deceasedContent.maritalstatus.question.replace('{deceasedName}', deceasedName),
                        deceasedContent.divorceplace.question.replace('{legalProcess}', deceasedContent.maritalstatus.divorce),
                        deceasedContent.divorcedate.question.replace('{legalProcess}', deceasedContent.maritalstatus.divorce),
                        deceasedContent.divorcedate.date.replace('{legalProcess}', deceasedContent.maritalstatus.divorce),
                        deceasedContent.married.question.replace('{deceasedName}', deceasedName)
                    ];

                    testWrapper.agent.get(testWrapper.pageUrl)
                        .expect('Content-type', /html/)
                        .then((response) => {
                            let previousPosition = -1;
                            questionsInOrder.forEach((questionText) => {
                                const currentPosition = response.text.toLowerCase().indexOf(questionText.toLowerCase());
                                expect(currentPosition, `Expected to find question: ${questionText}`).to.be.greaterThan(-1);
                                expect(currentPosition, `Question out of order: ${questionText}`).to.be.greaterThan(previousPosition);
                                previousPosition = currentPosition;
                            });
                            done();
                        })
                        .catch((requestErr) => done(requestErr));
                });
        });
    });
});
