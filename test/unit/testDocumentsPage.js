// eslint-disable-line max-lines

'use strict';

const initSteps = require('app/core/initSteps');
const {assert, expect} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const co = require('co');
const caseTypes = require('app/utils/CaseTypes');

describe('Documents', () => {
    const Documents = steps.Documents;

    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const url = Documents.constructor.getUrl();
            expect(url).to.equal('/documents');
            done();
        });
    });

    describe('handleGet()', () => {
        describe('Common', () => {
            let ctxToTest;

            beforeEach(() => {
                ctxToTest = {
                    caseType: caseTypes.GOP
                };
            });

            it('should return the given registry address when a registry address is given', (done) => {
                const formdata = {
                    registry: {
                        address: '1 Red Road, London, L1 1LL'
                    }
                };
                const [ctx] = Documents.handleGet(ctxToTest, formdata);
                expect(ctx.registryAddress).to.equal('1 Red Road, London, L1 1LL');
                done();
            });

            it('should return the default registry address when a registry address is not given', (done) => {
                const formdata = {
                    registry: {}
                };
                const [ctx] = Documents.handleGet(ctxToTest, formdata);
                expect(ctx.registryAddress).to.equal('Principal Registry of the Family Division (PRFD)' +
                    '\nHMCTS Probate\nPO BOX 12625\nHarlow\nCM20 9QE');
                done();
            });

            it('should return true when iht method is paper and iht form is IHT205', (done) => {
                const formdata = {
                    iht: {
                        method: 'optionPaper',
                        form: 'optionIHT205'
                    }
                };
                const [ctx] = Documents.handleGet(ctxToTest, formdata);
                expect(ctx.is205).to.equal(true);
                done();
            });

            it('should return false when iht method is paper and iht form is not IHT205', (done) => {
                const formdata = {
                    iht: {
                        method: 'optionPaper',
                        form: 'optionIHT207'
                    }
                };
                const [ctx] = Documents.handleGet(ctxToTest, formdata);
                expect(ctx.is205).to.equal(false);
                done();
            });

            it('should return false when iht method is not paper', (done) => {
                const formdata = {
                    iht: {
                        method: 'optionOnline'
                    }
                };
                const [ctx] = Documents.handleGet(ctxToTest, formdata);
                expect(ctx.is205).to.equal(false);
                done();
            });

            it('should return undefined when iht data is not given', (done) => {
                const formdata = {};
                const [ctx] = Documents.handleGet(ctxToTest, formdata);
                assert.isUndefined(ctx.is205);
                done();
            });

            it('should return true when iht method is paper and iht form is IHT207', (done) => {
                const formdata = {
                    iht: {
                        method: 'optionPaper',
                        form: 'optionIHT207'
                    }
                };
                const [ctx] = Documents.handleGet(ctxToTest, formdata);
                expect(ctx.is207).to.equal(true);
                done();
            });

            it('should return false when iht method is paper and iht form is not IHT207', (done) => {
                const formdata = {
                    iht: {
                        method: 'optionPaper',
                        form: 'optionIHT205'
                    }
                };
                const [ctx] = Documents.handleGet(ctxToTest, formdata);
                expect(ctx.is207).to.equal(false);
                done();
            });

            it('should return false when iht method is not paper', (done) => {
                const formdata = {
                    iht: {
                        method: 'optionOnline'
                    }
                };
                const [ctx] = Documents.handleGet(ctxToTest, formdata);
                expect(ctx.is207).to.equal(false);
                done();
            });

            it('should return true when iht estate form is IHT207', (done) => {
                const formdata = {
                    iht: {
                        ihtFormEstateId: 'optionIHT207'
                    }
                };
                const [ctx] = Documents.handleGet(ctxToTest, formdata);
                expect(ctx.is207).to.equal(true);
                done();
            });

            it('should return false when iht estate form is not IHT207', (done) => {
                const formdata = {
                    iht: {
                        ihtFormEstateId: 'optionIHT400421'
                    }
                };
                const [ctx] = Documents.handleGet(ctxToTest, formdata);
                expect(ctx.is207).to.equal(false);
                done();
            });

            it('should return undefined when iht data is not given', (done) => {
                const formdata = {};
                const [ctx] = Documents.handleGet(ctxToTest, formdata);
                assert.isUndefined(ctx.is207);
                done();
            });

            it('should return the ccd case id when a ccd case id is given', (done) => {
                const formdata = {
                    ccdCase: {
                        id: 1234567890123456,
                        state: 'CaseCreated'
                    }
                };
                const [ctx] = Documents.handleGet(ctxToTest, formdata);
                expect(ctx.ccdReferenceNumber).to.equal('1234-5678-9012-3456');
                done();
            });

            it('should return an empty string when a ccd case id is not given', (done) => {
                const formdata = {
                    ccdCase: {}
                };
                const [ctx] = Documents.handleGet(ctxToTest, formdata);
                expect(ctx.ccdReferenceNumber).to.equal('');
                done();
            });

            it('should return true when death certificate is interim', (done) => {
                const formdata = {
                    deceased: {
                        deathCertificate: 'optionInterimCertificate'
                    }
                };
                const [ctx] = Documents.handleGet(ctxToTest, formdata);
                expect(ctx.interimDeathCertificate).to.equal(true);
                done();
            });

            it('should return false when death certificate is not interim', (done) => {
                const formdata = {
                    deceased: {
                        deathCertificate: 'optionDeathCertificate'
                    }
                };
                const [ctx] = Documents.handleGet(ctxToTest, formdata);
                expect(ctx.interimDeathCertificate).to.equal(false);
                done();
            });

            it('should return true when death certificate is foreign', (done) => {
                const formdata = {
                    deceased: {
                        diedEngOrWales: 'optionNo'
                    }
                };
                const [ctx] = Documents.handleGet(ctxToTest, formdata);
                expect(ctx.foreignDeathCertificate).to.equal(true);
                done();
            });

            it('should return false when death certificate is not foreign', (done) => {
                const formdata = {
                    deceased: {
                        diedEngOrWales: 'optionYes'
                    }
                };
                const [ctx] = Documents.handleGet(ctxToTest, formdata);
                expect(ctx.foreignDeathCertificate).to.equal(false);
                done();
            });

            it('should return true when foreign death certificate is translated separately', (done) => {
                const formdata = {
                    deceased: {
                        foreignDeathCertTranslation: 'optionNo'
                    }
                };
                const [ctx] = Documents.handleGet(ctxToTest, formdata);
                expect(ctx.foreignDeathCertTranslatedSeparately).to.equal(true);
                done();
            });

            it('should return false when foreign death certificate is translated separately', (done) => {
                const formdata = {
                    deceased: {
                        foreignDeathCertTranslation: 'optionYes'
                    }
                };
                const [ctx] = Documents.handleGet(ctxToTest, formdata);
                expect(ctx.foreignDeathCertTranslatedSeparately).to.equal(false);
                done();
            });

            it('should return deceasedWrittenWishes on ctx', (done) => {
                const formdata = {
                    will: {
                        deceasedWrittenWishes: 'optionYes'
                    }
                };
                const [ctx] = Documents.handleGet(ctxToTest, formdata);
                expect(ctx.deceasedWrittenWishes).to.equal('optionYes');
                done();
            });
        });

        describe('Probate Journey', () => {
            let ctxToTest;

            beforeEach(() => {
                ctxToTest = {
                    caseType: caseTypes.GOP
                };
            });

            it('should return true when there are codicils', (done) => {
                const formdata = {
                    will: {
                        codicils: 'optionYes'
                    }
                };
                const [ctx] = Documents.handleGet(ctxToTest, formdata);
                expect(ctx.hasCodicils).to.equal(true);
                done();
            });

            it('should return false when there are no codicils', (done) => {
                const formdata = {
                    will: {
                        codicils: 'optionNo'
                    }
                };
                const [ctx] = Documents.handleGet(ctxToTest, formdata);
                expect(ctx.hasCodicils).to.equal(false);
                done();
            });

            it('should return the codicils number when a codicils number is given', (done) => {
                const formdata = {
                    will: {
                        codicilsNumber: 2
                    }
                };
                const [ctx] = Documents.handleGet(ctxToTest, formdata);
                expect(ctx.codicilsNumber).to.equal(2);
                done();
            });

            it('should return true when there are multiple applicants', (done) => {
                const formdata = {
                    executors: {
                        list: [
                            {isApplicant: true, isApplying: true},
                            {isApplying: true}
                        ]
                    }
                };
                const [ctx] = Documents.handleGet(ctxToTest, formdata);
                expect(ctx.hasMultipleApplicants).to.equal(true);
                done();
            });

            it('should return false when there is a single applicant', (done) => {
                const formdata = {
                    executors: {
                        list: [
                            {isApplicant: true, isApplying: true}
                        ]
                    }
                };
                const [ctx] = Documents.handleGet(ctxToTest, formdata);
                expect(ctx.hasMultipleApplicants).to.equal(false);
                done();
            });

            it('should return false when there is a single applicant', (done) => {
                const formdata = {
                    executors: {
                        list: [
                            {isApplicant: true, isApplying: true}
                        ]
                    }
                };
                const [ctx] = Documents.handleGet(ctxToTest, formdata);
                expect(ctx.hasMultipleApplicants).to.equal(false);
                done();
            });

            it('should return true when an executor has optionRenunciated set', (done) => {
                const formdata = {
                    executors: {
                        list: [
                            {notApplyingKey: 'optionRenunciated'}
                        ]
                    }
                };
                const [ctx] = Documents.handleGet(ctxToTest, formdata);
                expect(ctx.hasRenunciated).to.equal(true);
                done();
            });

            it('should return false when an executor does not have optionRenunciated set', (done) => {
                const formdata = {
                    executors: {
                        list: []
                    }
                };
                const [ctx] = Documents.handleGet(ctxToTest, formdata);
                expect(ctx.hasRenunciated).to.equal(false);
                done();
            });

            it('should return true when an executor has changed their name by deed poll', (done) => {
                const formdata = {
                    executors: {
                        list: [
                            {alias: 'Sam Williams', aliasReason: 'optionDeedPoll'}
                        ]
                    }
                };
                const [ctx] = Documents.handleGet(ctxToTest, formdata);
                expect(ctx.executorsNameChangedByDeedPollList).to.deep.equal(['Sam Williams']);
                done();
            });

            it('should return false when an executor has not changed their name by deed poll', (done) => {
                const formdata = {
                    executors: {
                        list: [
                            {alias: 'Sam Williams', aliasReason: 'optionDivorce'}
                        ]
                    }
                };
                const [ctx] = Documents.handleGet(ctxToTest, formdata);
                expect(ctx.executorsNameChangedByDeedPollList).to.deep.equal([]);
                done();
            });
        });
    });

    describe('runnerOptions', () => {
        let session;
        let ctx;

        beforeEach(() => {
            session = {
                form: {},
            };
            ctx = {};
        });

        it('do not redirect if journey is gop', (done) => {
            session.form = {caseType: caseTypes.GOP};
            const ctx = {};
            co(function* () {
                const options = yield Documents.runnerOptions(ctx, session);
                expect(options).to.deep.equal({});
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('do not redirect if journey is intestacy and a form IHT205 was used', (done) => {
            session.form = {caseType: caseTypes.INTESTACY};
            session.form.iht = {method: 'optionPaper', form: 'optionIHT205'};

            co(function* () {
                const options = yield Documents.runnerOptions(ctx, session);

                expect(options).to.deep.equal({});
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('do not redirect if journey is intestacy and deceased was married and applicant is child', (done) => {
            session.form = {
                deceased: {maritalStatus: 'optionMarried'},
                applicant: {relationshipToDeceased: 'optionChild'},
                caseType: caseTypes.INTESTACY
            };
            co(function* () {
                const options = yield Documents.runnerOptions(ctx, session);

                expect(options).to.deep.equal({});
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('do not redirect if journey is intestacy and deceased was married and applicant is adopted child', (done) => {
            session.form = {
                deceased: {maritalStatus: 'optionMarried'},
                applicant: {relationshipToDeceased: 'optionAdoptedChild'},
                caseType: caseTypes.INTESTACY
            };
            co(function* () {
                const options = yield Documents.runnerOptions(ctx, session);

                expect(options).to.deep.equal({});
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('do not redirect if journey is intestacy and death certificate is interim', (done) => {
            session.form = {
                deceased: {deathCertificate: 'optionInterimCertificate'},
                caseType: caseTypes.INTESTACY
            };
            co(function* () {
                const options = yield Documents.runnerOptions(ctx, session);

                expect(options).to.deep.equal({});
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('do not redirect if journey is intestacy and death certificate is foreign', (done) => {
            session.form = {
                deceased: {diedEngOrWales: 'optionNo'},
                caseType: caseTypes.INTESTACY
            };
            co(function* () {
                const options = yield Documents.runnerOptions(ctx, session);

                expect(options).to.deep.equal({});
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('redirect if journey is intestacy and a none of the other conditions apply', (done) => {
            session.form = {
                deceased: {maritalStatus: 'optionSeparated'},
                iht: {method: 'optionPaper', form: 'optionIHT207'},
                caseType: caseTypes.INTESTACY
            };
            co(function* () {
                const options = yield Documents.runnerOptions(ctx, session);

                expect(options).to.deep.equal({
                    redirect: true,
                    url: '/thank-you'
                });
                done();
            }).catch(err => {
                done(err);
            });
        });
    });
});
