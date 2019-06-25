// eslint-disable-line max-lines

'use strict';

const initSteps = require('app/core/initSteps');
const {assert, expect} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const co = require('co');
const contentDeceasedMaritalStatus = require('app/resources/en/translation/deceased/maritalstatus');
const contentRelationshipToDeceased = require('app/resources/en/translation/applicant/relationshiptodeceased');
const contentIhtMethod = require('app/resources/en/translation/iht/method');

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
                    journeyType: 'gop'
                };
            });

            it('should return the given registry address when a registry address is given', (done) => {
                const formdata = {
                    registry: {
                        address: '1 Red Road, London, L1 1LL'
                    }
                };
                const featureToggles = {};
                const [ctx] = Documents.handleGet(ctxToTest, formdata, featureToggles);
                expect(ctx.registryAddress).to.equal('1 Red Road, London, L1 1LL');
                done();
            });

            it('should return the default registry address when a registry address is not given', (done) => {
                const formdata = {
                    registry: {}
                };
                const featureToggles = {};
                const [ctx] = Documents.handleGet(ctxToTest, formdata, featureToggles);
                expect(ctx.registryAddress).to.equal('Digital Application\nOxford District Probate Registry\nCombined Court Building\nSt Aldates\nOxford\nOX1 1LY');
                done();
            });

            it('should return true when iht method is paper and iht form is IHT205', (done) => {
                const formdata = {
                    iht: {
                        method: 'By post',
                        form: 'IHT205'
                    }
                };
                const featureToggles = {};
                const [ctx] = Documents.handleGet(ctxToTest, formdata, featureToggles);
                expect(ctx.is205).to.equal(true);
                done();
            });

            it('should return false when iht method is paper and iht form is not IHT205', (done) => {
                const formdata = {
                    iht: {
                        method: 'By post',
                        form: 'IHT207'
                    }
                };
                const featureToggles = {};
                const [ctx] = Documents.handleGet(ctxToTest, formdata, featureToggles);
                expect(ctx.is205).to.equal(false);
                done();
            });

            it('should return false when iht method is not paper', (done) => {
                const formdata = {
                    iht: {
                        method: 'Through the HMRC online service'
                    }
                };
                const featureToggles = {};
                const [ctx] = Documents.handleGet(ctxToTest, formdata, featureToggles);
                expect(ctx.is205).to.equal(false);
                done();
            });

            it('should return undefined when iht data is not given', (done) => {
                const formdata = {};
                const featureToggles = {};
                const [ctx] = Documents.handleGet(ctxToTest, formdata, featureToggles);
                assert.isUndefined(ctx.is205);
                done();
            });

            it('should return the ccd case id when a ccd case id is given', (done) => {
                const formdata = {
                    ccdCase: {
                        id: '1234-5678-9012-3456',
                        state: 'CaseCreated'
                    }
                };
                const featureToggles = {};
                const [ctx] = Documents.handleGet(ctxToTest, formdata, featureToggles);
                expect(ctx.ccdReferenceNumber).to.equal('1234-5678-9012-3456');
                done();
            });

            it('should return an empty string when a ccd case id is not given', (done) => {
                const formdata = {
                    ccdCase: {}
                };
                const featureToggles = {};
                const [ctx] = Documents.handleGet(ctxToTest, formdata, featureToggles);
                expect(ctx.ccdReferenceNumber).to.equal('');
                done();
            });
        });

        describe('Probate Journey', () => {
            let ctxToTest;

            beforeEach(() => {
                ctxToTest = {
                    journeyType: 'gop'
                };
            });

            it('should return true when there are codicils', (done) => {
                const formdata = {
                    will: {
                        codicils: 'Yes'
                    }
                };
                const featureToggles = {};
                const [ctx] = Documents.handleGet(ctxToTest, formdata, featureToggles);
                expect(ctx.hasCodicils).to.equal(true);
                done();
            });

            it('should return false when there are no codicils', (done) => {
                const formdata = {
                    will: {
                        codicils: 'No'
                    }
                };
                const featureToggles = {};
                const [ctx] = Documents.handleGet(ctxToTest, formdata, featureToggles);
                expect(ctx.hasCodicils).to.equal(false);
                done();
            });

            it('should return the codicils number when a codicils number is given', (done) => {
                const formdata = {
                    will: {
                        codicilsNumber: 2
                    }
                };
                const featureToggles = {};
                const [ctx] = Documents.handleGet(ctxToTest, formdata, featureToggles);
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
                const featureToggles = {};
                const [ctx] = Documents.handleGet(ctxToTest, formdata, featureToggles);
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
                const featureToggles = {};
                const [ctx] = Documents.handleGet(ctxToTest, formdata, featureToggles);
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
                const featureToggles = {};
                const [ctx] = Documents.handleGet(ctxToTest, formdata, featureToggles);
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
                const featureToggles = {};
                const [ctx] = Documents.handleGet(ctxToTest, formdata, featureToggles);
                expect(ctx.hasRenunciated).to.equal(true);
                done();
            });

            it('should return false when an executor does not have optionRenunciated set', (done) => {
                const formdata = {
                    executors: {
                        list: []
                    }
                };
                const featureToggles = {};
                const [ctx] = Documents.handleGet(ctxToTest, formdata, featureToggles);
                expect(ctx.hasRenunciated).to.equal(false);
                done();
            });

            it('should return true when an executor has changed their name by deed poll', (done) => {
                const formdata = {
                    executors: {
                        list: [
                            {alias: 'Sam Williams', aliasReason: 'Change by deed poll'}
                        ]
                    }
                };
                const featureToggles = {};
                const [ctx] = Documents.handleGet(ctxToTest, formdata, featureToggles);
                expect(ctx.executorsNameChangedByDeedPollList).to.deep.equal(['Sam Williams']);
                done();
            });

            it('should return false when an executor has not changed their name by deed poll', (done) => {
                const formdata = {
                    executors: {
                        list: [
                            {alias: 'Sam Williams', aliasReason: 'Divorce'}
                        ]
                    }
                };
                const featureToggles = {};
                const [ctx] = Documents.handleGet(ctxToTest, formdata, featureToggles);
                expect(ctx.executorsNameChangedByDeedPollList).to.deep.equal([]);
                done();
            });
        });
    });

    describe('runnerOptions', () => {
        it('do not redirect if journey is gop', (done) => {
            const ctx = {
                journeyType: 'gop'
            };
            const formData = {};
            co(function* () {
                const options = yield Documents.runnerOptions(ctx, formData);

                expect(options).to.deep.equal({});
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('do not redirect if journey is intestacy and a document was not uploaded', (done) => {
            const ctx = {
                journeyType: 'intestacy'
            };
            const formData = {
                documents: {
                    uploads: []
                }
            };
            co(function* () {
                const options = yield Documents.runnerOptions(ctx, formData);

                expect(options).to.deep.equal({});
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('do not redirect if journey is intestacy and a form IHT205 was used', (done) => {
            const ctx = {
                journeyType: 'intestacy'
            };
            const formData = {
                iht: {
                    method: contentIhtMethod.optionPaper,
                    form: 'IHT205'
                }
            };
            co(function* () {
                const options = yield Documents.runnerOptions(ctx, formData);

                expect(options).to.deep.equal({});
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('do not redirect if journey is intestacy and deceased was married and applicant is child', (done) => {
            const ctx = {
                journeyType: 'intestacy'
            };
            const formData = {
                deceased: {
                    maritalStatus: contentDeceasedMaritalStatus.optionMarried
                },
                applicant: {
                    relationshipToDeceased: contentRelationshipToDeceased.optionChild
                }
            };
            co(function* () {
                const options = yield Documents.runnerOptions(ctx, formData);

                expect(options).to.deep.equal({});
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('do not redirect if journey is intestacy and deceased was married and applicant is adopted child', (done) => {
            const ctx = {
                journeyType: 'intestacy'
            };
            const formData = {
                deceased: {
                    maritalStatus: contentDeceasedMaritalStatus.optionMarried
                },
                applicant: {
                    relationshipToDeceased: contentRelationshipToDeceased.optionAdoptedChild
                }
            };
            co(function* () {
                const options = yield Documents.runnerOptions(ctx, formData);

                expect(options).to.deep.equal({});
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('redirect if journey is intestacy and a none of the other conditions apply', (done) => {
            const ctx = {
                journeyType: 'intestacy'
            };
            const formData = {
                deceased: {
                    maritalStatus: contentDeceasedMaritalStatus.optionSeparated
                },
                documents: {
                    uploads: [
                        'testfile.pdf'
                    ]
                },
                iht: {
                    method: contentIhtMethod.optionPaper,
                    form: 'IHT207'
                }
            };
            co(function* () {
                const options = yield Documents.runnerOptions(ctx, formData);

                expect(options).to.deep.equal({
                    redirect: true,
                    url: '/tasklist'
                });
                done();
            }).catch(err => {
                done(err);
            });
        });
    });
});
