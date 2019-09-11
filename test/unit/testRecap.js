'use strict';

const initSteps = require('app/core/initSteps');
const {expect} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const Recap = steps.Recap;
const contentWillCodicils = require('app/resources/en/translation/will/codicils');
const contentDeceasedMaritalStatus = require('app/resources/en/translation/deceased/maritalstatus');
const contentRelationshipToDeceased = require('app/resources/en/translation/applicant/relationshiptodeceased');
const contentIhtMethod = require('app/resources/en/translation/iht/method');

describe('Recap', () => {
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = Recap.constructor.getUrl();
            expect(url).to.equal('/recap');
            done();
        });
    });

    describe('getContextData()', () => {
        it('should return the correct ctx for a probate journey', (done) => {
            const req = {
                sessionID: 'dummy_sessionId',
                session: {
                    form: {
                        caseType: 'gop',
                        will: {
                            codicils: contentWillCodicils.optionYes,
                            codicilsNumber: '3'
                        },
                        iht: {
                            method: contentIhtMethod.optionPaper,
                            form: 'IHT205'
                        }
                    },
                    caseType: 'gop'
                }
            };
            const ctx = Recap.getContextData(req);
            expect(ctx).to.deep.equal({
                sessionID: 'dummy_sessionId',
                caseType: 'gop',
                ccdReferenceNumber: '1234-5678-9012-3456',
                ccdReferenceNumberAccessible: '1 2 3 4, -, 5 6 7 8, -, 9 0 1 2, -, 3 4 5 6',
                registryAddress: 'Digital Application\nOxford District Probate Registry\nCombined Court Building\nSt Aldates\nOxford\nOX1 1LY',
                hasCodicils: true,
                codicilsNumber: '3',
                hasMultipleApplicants: false,
                hasRenunciated: false,
                executorsNameChangedByDeedPollList: [],
                is205: true,
                checkAnswersSummary: true,
                legalDeclaration: true
            });
            done();
        });

        it('should return the correct ctx for an intestacy journey', (done) => {
            const req = {
                sessionID: 'dummy_sessionId',
                session: {
                    form: {
                        caseType: 'intestacy',
                        deceased: {
                            maritalStatus: contentDeceasedMaritalStatus.optionMarried
                        },
                        applicant: {
                            relationshipToDeceased: contentRelationshipToDeceased.optionChild
                        },
                        iht: {
                            method: contentIhtMethod.optionPaper,
                            form: 'IHT205'
                        }
                    },
                    caseType: 'intestacy'
                }
            };
            const ctx = Recap.getContextData(req);
            expect(ctx).to.deep.equal({
                sessionID: 'dummy_sessionId',
                caseType: 'intestacy',
                ccdReferenceNumber: '1234-5678-9012-3456',
                ccdReferenceNumberAccessible: '1 2 3 4, -, 5 6 7 8, -, 9 0 1 2, -, 3 4 5 6',
                registryAddress: 'Digital Application\nOxford District Probate Registry\nCombined Court Building\nSt Aldates\nOxford\nOX1 1LY',
                is205: true,
                spouseRenouncing: true,
                checkAnswersSummary: true,
                legalDeclaration: true
            });
            done();
        });
    });

    describe('action()', () => {
        it('test it cleans up context', () => {
            const ctx = {
                caseType: 'gop',
                ccdReferenceNumber: '1234-5678-9012-3456',
                ccdReferenceNumberAccessible: '1 2 3 4, -, 5 6 7 8, -, 9 0 1 2, -, 3 4 5 6',
                registryAddress: 'Some address',
                checkAnswersSummary: true,
                legalDeclaration: true,
                hasCodicils: true,
                codicilsNumber: 3,
                hasMultipleApplicants: false,
                hasRenunciated: false,
                executorsNameChangedByDeedPollList: false,
                spouseRenouncing: false,
                is205: true
            };
            const formdata = {};

            Recap.action(ctx, formdata);

            expect(ctx).to.deep.equal({});
        });
    });
});
