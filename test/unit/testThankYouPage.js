'use strict';

const initSteps = require('app/core/initSteps');
const co = require('co');
const expect = require('chai').expect;
const rewire = require('rewire');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const ThankYou = rewire('app/steps/ui/thankyou');
const i18next = require('i18next');
const caseTypes = require('../../app/utils/CaseTypes');

describe('ThankYou', () => {
    let section;
    let templatePath;
    let schema;

    beforeEach(() => {
        section = 'paymentStatus';
        templatePath = 'payment/status';
        schema = {
            $schema: 'http://json-schema.org/draft-07/schema',
            properties: {}
        };
    });
    describe('getUrl()', () => {
        it('should return the correct url', (done) => {
            const thankYou = new ThankYou(steps, section, templatePath, i18next, schema);

            const url = thankYou.constructor.getUrl();
            expect(url).to.equal('/thank-you');
            done();
        });
    });
    describe('getContextData()', () => {
        let ctx;
        let req;

        it('should return the context with the ccd case id with state CasePrinted', (done) => {
            req = {
                session: {
                    form: {
                        ccdCase: {
                            id: 1234567890123456,
                            state: 'CasePrinted'
                        }
                    }
                }
            };
            const thankYou = new ThankYou(steps, section, templatePath, i18next, schema);
            ctx = thankYou.getContextData(req);
            expect(ctx.ccdReferenceNumber).to.deep.equal('1234-5678-9012-3456');
            expect(ctx.ccdReferenceNumberAccessible).to.deep.equal('1 2 3 4, -, 5 6 7 8, -, 9 0 1 2, -, 3 4 5 6');
            expect(ctx.documentsReceived).to.equal(false);
            expect(ctx.applicationInReview).to.equal(false);
            expect(ctx.grantIssued).to.equal(false);
            done();
        });
        it('should return the context with the ccd case id with state CasePrinted and notification sent', (done) => {
            req = {
                session: {
                    form: {
                        ccdCase: {
                            id: 1234567890123456,
                            state: 'CasePrinted'
                        },
                        documentsReceivedNotificationSent: 'true'
                    }
                }
            };
            const thankYou = new ThankYou(steps, section, templatePath, i18next, schema);
            ctx = thankYou.getContextData(req);
            expect(ctx.documentsReceived).to.equal(true);
            expect(ctx.applicationInReview).to.equal(false);
            expect(ctx.grantIssued).to.equal(false);
            done();
        });
        it('should return the context with the ccd case id with state BOReadyToIssue', (done) => {
            req = {
                session: {
                    form: {
                        ccdCase: {
                            id: 1234567890123456,
                            state: 'BOReadyToIssue'
                        }
                    }
                }
            };
            const thankYou = new ThankYou(steps, section, templatePath, i18next, schema);
            ctx = thankYou.getContextData(req);
            expect(ctx.documentsReceived).to.equal(true);
            expect(ctx.applicationInReview).to.equal(true);
            expect(ctx.grantIssued).to.equal(false);
            done();
        });
        it('should return the context with the ccd case id with state BOGrantIssued', (done) => {
            req = {
                session: {
                    form: {
                        ccdCase: {
                            id: 1234567890123456,
                            state: 'BOGrantIssued'
                        }
                    }
                }
            };
            const thankYou = new ThankYou(steps, section, templatePath, i18next, schema);
            ctx = thankYou.getContextData(req);
            expect(ctx.documentsReceived).to.equal(true);
            expect(ctx.applicationInReview).to.equal(true);
            expect(ctx.grantIssued).to.equal(true);
            done();
        });
    });

    describe('action()', () => {
        it('test that context variables are removed and empty object returned', () => {
            let formdata = {};
            let ctx = {
                ccdReferenceNumber: '1234-1235-1236-1237',
                ccdReferenceNumberAccessible: '1 2 3 4, -, 5 6 7 8, -, 9 0 1 2, -, 3 4 5 6'
            };
            const thankYou = new ThankYou(steps, section, templatePath, i18next, schema);
            [ctx, formdata] = thankYou.action(ctx, formdata);
            expect(ctx).to.deep.equal({});
        });
    });

    describe('handleGet()', () => {
        it('test when checkAnswersSummary JSON just exists', () => {
            let ctx = {};
            let formdata = {
                checkAnswersSummary: '{"test":"data"}'
            };
            const thankYou = new ThankYou(steps, section, templatePath, i18next, schema);
            [ctx, formdata] = thankYou.handleGet(ctx, formdata);
            expect(ctx.checkAnswersSummary).to.deep.equal(true);
            expect(ctx.legalDeclaration).to.deep.equal(false);
        });

        it('test when legalDeclaration JSON just exists', () => {
            let ctx = {};
            let formdata = {
                legalDeclaration: '{"test":"data"}'
            };
            const thankYou = new ThankYou(steps, section, templatePath, i18next, schema);
            [ctx, formdata] = thankYou.handleGet(ctx, formdata);
            expect(ctx.checkAnswersSummary).to.deep.equal(false);
            expect(ctx.legalDeclaration).to.deep.equal(true);
        });

        it('test when no pdf variables JSON exists', () => {
            let ctx = {};
            let formdata = {};
            const thankYou = new ThankYou(steps, section, templatePath, i18next, schema);
            [ctx, formdata] = thankYou.handleGet(ctx, formdata);
            expect(ctx.checkAnswersSummary).to.deep.equal(false);
            expect(ctx.legalDeclaration).to.deep.equal(false);
        });

        it('test when all pdf variables JSON exists', () => {
            let ctx = {};
            let formdata = {
                checkAnswersSummary: '{"test":"data"}',
                legalDeclaration: '{"test":"data"}'
            };
            const thankYou = new ThankYou(steps, section, templatePath, i18next, schema);
            [ctx, formdata] = thankYou.handleGet(ctx, formdata);
            expect(ctx.checkAnswersSummary).to.deep.equal(true);
            expect(ctx.legalDeclaration).to.deep.equal(true);
        });

        it('should set documentsRequired to true when documents are required', (done) => {
            const revertDocumentsWrapper = ThankYou.__set__({
                DocumentsWrapper: class {
                    documentsRequired() {
                        return true;
                    }
                }
            });
            const thankYou = new ThankYou(steps, section, templatePath, i18next, schema);
            co(function* () {
                const [ctx] = thankYou.handleGet({}, {});
                expect(ctx.documentsRequired).to.deep.equal(true);
                revertDocumentsWrapper();
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('should set documentsRequired to false when documents are not required', (done) => {
            const revertDocumentsWrapper = ThankYou.__set__({
                DocumentsWrapper: class {
                    documentsRequired() {
                        return false;
                    }
                }
            });
            const thankYou = new ThankYou(steps, section, templatePath, i18next, schema);
            co(function* () {
                const [ctx] = thankYou.handleGet({}, {});
                expect(ctx.documentsRequired).to.deep.equal(false);
                revertDocumentsWrapper();
                done();
            }).catch(err => {
                done(err);
            });
        });
        it('should return deceasedWrittenWishes on ctx', () => {
            const formdata = {
                will: {
                    deceasedWrittenWishes: 'optionYes'
                }
            };
            const thankYou = steps.ThankYou;
            const [ctx] = thankYou.handleGet({}, formdata);
            expect(ctx.deceasedWrittenWishes).to.deep.equal('optionYes');
        });
        it('should return true when spouse is giving up rights as administrator and applicant is child', (done) => {
            const formdata = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionMarried',
                    anyOtherChildren: 'optionNo'
                },
                applicant: {
                    relationshipToDeceased: 'optionChild',
                    spouseNotApplyingReason: 'optionRenouncing'
                }
            };
            const thankYou = steps.ThankYou;
            const [ctx] = thankYou.handleGet({}, formdata);
            expect(ctx.isSpouseGivingUpAdminRights).to.deep.equal(true);
            done();
        });
        it('should return true when spouse is giving up rights as administrator and applicant is adopted child', (done) => {
            const formdata = {
                caseType: caseTypes.INTESTACY,
                deceased: {
                    maritalStatus: 'optionMarried',
                    anyOtherChildren: 'optionNo'
                },
                applicant: {
                    relationshipToDeceased: 'optionAdoptedChild',
                    spouseNotApplyingReason: 'optionRenouncing'
                }
            };
            const thankYou = steps.ThankYou;
            const [ctx] = thankYou.handleGet({}, formdata);
            expect(ctx.isSpouseGivingUpAdminRights).to.deep.equal(true);
            done();
        });
        it('should return is205 on ctx', (done) => {
            const formdata = {
                iht: {
                    method: 'optionPaper',
                    form: 'optionIHT205'
                }
            };
            const thankYou = steps.ThankYou;
            const [ctx] = thankYou.handleGet({}, formdata);
            expect(ctx.is205).to.deep.equal(true);
            done();
        });
        it('should return is207 on ctx for paper', (done) => {
            const formdata = {
                iht: {
                    method: 'optionPaper',
                    form: 'optionIHT207'
                }
            };
            const thankYou = steps.ThankYou;
            const [ctx] = thankYou.handleGet({}, formdata);
            expect(ctx.is207).to.deep.equal(true);
            done();
        });
        it('should return the given registry address when a registry address is given', (done) => {
            const formdata = {
                registry: {
                    address: '1 Red Road, London, L1 1LL'
                }
            };
            const thankYou = steps.ThankYou;
            const [ctx] = thankYou.handleGet({}, formdata);
            expect(ctx.registryAddress).to.equal('1 Red Road, London, L1 1LL');
            done();
        });
        it('should return the default registry address when a registry address is not given', (done) => {
            const formdata = {
                registry: {}
            };
            const thankYou = steps.ThankYou;
            const [ctx] = thankYou.handleGet({}, formdata);
            expect(ctx.registryAddress).to.equal('Principal Registry of the Family Division (PRFD)' +
                '\nHMCTS Probate\nPO BOX 12625\nHarlow\nCM20 9QE');
            done();
        });
    });
});
