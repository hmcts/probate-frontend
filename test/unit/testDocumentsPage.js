'use strict';

const initSteps = require('app/core/initSteps');
const {assert, expect} = require('chai');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);

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
        it('should return the given registry address when a registry address is given', (done) => {
            const ctxToTest = {};
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
            const ctxToTest = {};
            const formdata = {
                registry: {}
            };
            const featureToggles = {};
            const [ctx] = Documents.handleGet(ctxToTest, formdata, featureToggles);
            expect(ctx.registryAddress).to.equal('Digital Application\nOxford District Probate Registry\nCombined Court Building\nSt Aldates\nOxford\nOX1 1LY');
            done();
        });

        it('should return true when there are codicils', (done) => {
            const ctxToTest = {};
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
            const ctxToTest = {};
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
            const ctxToTest = {};
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
            const ctxToTest = {};
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
            const ctxToTest = {};
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
            const ctxToTest = {};
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
            const ctxToTest = {};
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
            const ctxToTest = {};
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

        it('should return true when iht method is paper and iht form is IHT205', (done) => {
            const ctxToTest = {};
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
            const ctxToTest = {};
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
            const ctxToTest = {};
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
            const ctxToTest = {};
            const formdata = {};
            const featureToggles = {};
            const [ctx] = Documents.handleGet(ctxToTest, formdata, featureToggles);
            assert.isUndefined(ctx.is205);
            done();
        });

        it('should return true when an executor has changed their name by deed poll', (done) => {
            const ctxToTest = {};
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
            const ctxToTest = {};
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

        it('should return the ccd case id when a ccd case id is given', (done) => {
            const ctxToTest = {};
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
            const ctxToTest = {};
            const formdata = {
                ccdCase: {}
            };
            const featureToggles = {};
            const [ctx] = Documents.handleGet(ctxToTest, formdata, featureToggles);
            expect(ctx.ccdReferenceNumber).to.equal('');
            done();
        });

        it('should return true when the document upload toggle is set', (done) => {
            const ctxToTest = {};
            const formdata = {};
            const featureToggles = {
                document_upload: true
            };
            const [ctx] = Documents.handleGet(ctxToTest, formdata, featureToggles);
            expect(ctx.isDocumentUploadToggleEnabled).to.equal(true);
            done();
        });

        it('should return false when the document upload toggle is not set', (done) => {
            const ctxToTest = {};
            const formdata = {};
            const featureToggles = {};
            const [ctx] = Documents.handleGet(ctxToTest, formdata, featureToggles);
            expect(ctx.isDocumentUploadToggleEnabled).to.equal(false);
            done();
        });
    });
});
