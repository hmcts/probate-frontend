'use strict';

const initSteps = require('app/core/initSteps');
const co = require('co');
const expect = require('chai').expect;
const rewire = require('rewire');
const steps = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]);
const ThankYou = rewire('app/steps/ui/thankyou');
const i18next = require('i18next');

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

        it('should return the context with the ccd case id', (done) => {
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
            const expectedContext = {
                checkAnswersSummary: false,
                documentsRequired: true,
                legalDeclaration: false
            };
            const thankYou = new ThankYou(steps, section, templatePath, i18next, schema);
            co(function* () {
                const [ctx] = thankYou.handleGet({}, {});
                expect(ctx).to.deep.equal(expectedContext);
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
            const expectedContext = {
                checkAnswersSummary: false,
                documentsRequired: false,
                legalDeclaration: false
            };
            const thankYou = new ThankYou(steps, section, templatePath, i18next, schema);
            co(function* () {
                const [ctx] = thankYou.handleGet({}, {});
                expect(ctx).to.deep.equal(expectedContext);
                revertDocumentsWrapper();
                done();
            }).catch(err => {
                done(err);
            });
        });
    });
});
