'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const HmrcLetter = steps.HmrcLetter;

describe('HmrcLetter', () => {
    describe('getContextData()', () => {
        it('should set threshold flags for date of death before the excepted estate threshold', (done) => {
            const req = {
                sessionID: 'session-id-1',
                body: {},
                session: {
                    language: 'en',
                    featureToggles: {},
                    form: {
                        ccdCase: {id: '1234567890123456'},
                        deceased: {
                            'dod-date': '2021-12-31',
                            deathCertificate: 'optionDeathCertificate'
                        },
                        iht: {}
                    }
                }
            };

            const result = HmrcLetter.getContextData(req);
            expect(result.dodBeforeEeDodThreshold).to.equal(true);
            expect(result.dodAfterEeDodThreshold).to.equal(false);
            expect(result.isInterimDeathCertificate).to.equal(false);
            done();
        });

        it('should set interim-certificate flag and post-threshold date flag', (done) => {
            const req = {
                sessionID: 'session-id-2',
                body: {},
                session: {
                    language: 'en',
                    featureToggles: {},
                    form: {
                        ccdCase: {id: '1234567890123456'},
                        deceased: {
                            'dod-date': '2022-01-02',
                            deathCertificate: 'optionInterimCertificate'
                        },
                        iht: {}
                    }
                }
            };

            const result = HmrcLetter.getContextData(req);
            expect(result.dodBeforeEeDodThreshold).to.equal(false);
            expect(result.dodAfterEeDodThreshold).to.equal(true);
            expect(result.isInterimDeathCertificate).to.equal(true);
            done();
        });
    });

    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = HmrcLetter.constructor.getUrl();
            expect(url).to.equal('/hmrc-letter');
            done();
        });
    });
    describe('nextStepOptions()', () => {
        it('should return the correct next step options', (done) => {
            const result = HmrcLetter.nextStepOptions({
                hmrcLetterId: 'optionYes',
                dodBeforeEeDodThreshold: false,
                dodAfterEeDodThreshold: true,
                isInterimDeathCertificate: false
            });
            expect(result).to.deep.equal({
                options: [
                    {key: 'hmrcLetterId', value: 'optionYes', choice: 'hmrcLetter'},
                    {key: 'noHmrcLetterBeforeEeThreshold', value: true, choice: 'noHmrcLetterBeforeEeThreshold'},
                    {key: 'noHmrcLetterAfterEeThreshold', value: true, choice: 'noHmrcLetterAfterEeThreshold'}
                ]
            });
            done();
        });
    });

    describe('handlePost()', () => {
        it('should clear unique probate code when HMRC letter is not received', (done) => {
            const ctx = {
                hmrcLetterId: 'optionNo',
                uniqueProbateCodeId: 'CTS04052311043tpps8e9'
            };
            const errors = [];
            const [updatedCtx] = HmrcLetter.handlePost(ctx, errors);
            expect(updatedCtx).to.deep.equal({
                hmrcLetterId: 'optionNo'
            });
            done();
        });
    });

    describe('isComplete()', () => {
        it('should be complete when hmrcLetterId is optionYes', (done) => {
            const result = HmrcLetter.isComplete({
                hmrcLetterId: 'optionYes',
                noHmrcLetterAfterEeThreshold: false
            });

            expect(result).to.deep.equal([true, 'inProgress']);
            done();
        });

        it('should be complete when no HMRC letter is valid after threshold', (done) => {
            const result = HmrcLetter.isComplete({
                hmrcLetterId: 'optionNo',
                noHmrcLetterAfterEeThreshold: true
            });

            expect(result).to.deep.equal([true, 'inProgress']);
            done();
        });

        it('should be in progress when hmrcLetterId is optionNo and after-threshold flag is false', (done) => {
            const result = HmrcLetter.isComplete({
                hmrcLetterId: 'optionNo',
                noHmrcLetterAfterEeThreshold: false
            });

            expect(result).to.deep.equal([false, 'inProgress']);
            done();
        });
    });
});
