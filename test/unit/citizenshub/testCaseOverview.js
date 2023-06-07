'use strict';

const initSteps = require('app/core/initSteps');
const expect = require('chai').expect;
const rewire = require('rewire');
const steps = initSteps([`${__dirname}/../../../app/steps/action/`, `${__dirname}/../../../app/steps/ui`]);
const CitizensHub = rewire('app/steps/ui/citizenshub');
const i18next = require('i18next');
const co = require('co');

describe('CitizensHub', () => {
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
            const citizensHub = new CitizensHub(steps, section, templatePath, i18next, schema);

            const url = citizensHub.constructor.getUrl();
            expect(url).to.equal('/citizens-hub');
            done();
        });
    });

    describe('getContextData() with Reference Number', () => {
        let ctx;
        let req;

        it('should return the context with the ccd case id & Deceased Name', (done) => {
            req = {
                session: {
                    form: {
                        ccdCase: {
                            id: 1234567890123456,
                            state: 'CaseCreated'
                        },
                        deceased: {
                            firstName: 'Peter',
                            lastName: 'Williams'
                        }
                    }
                }
            };
            const citizensHub = new CitizensHub(steps, section, templatePath, i18next, schema);
            ctx = citizensHub.getContextData(req);
            expect(ctx.ccdReferenceNumber).to.deep.equal('1234-5678-9012-3456');
            expect(ctx.ccdReferenceNumberAccessible).to.deep.equal('1 2 3 4, -, 5 6 7 8, -, 9 0 1 2, -, 3 4 5 6');
            expect(ctx.deceasedName).to.deep.equal('Peter Williams');

            done();
        });
    });

    describe('getContextData()', () => {
        let ctx;
        let req;
        it('should return the context with case progress for CasePrinted', (done) => {
            req = {
                session: {
                    form: {
                        ccdCase: {
                            id: 1234567890123456,
                            state: 'CasePrinted'
                        },
                        deceased: {
                            firstName: 'Peter',
                            lastName: 'Williams'
                        }
                    }
                }
            };
            const citizensHub = new CitizensHub(steps, section, templatePath, i18next, schema);
            ctx = citizensHub.getContextData(req);
            expect(ctx.documentsReceived).to.equal(false);
            expect(ctx.applicationInReview).to.equal(false);
            expect(ctx.grantIssued).to.equal(false);
            done();
        });
        it('should return the context with case progress for CasePrinted and notification sent', (done) => {
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
            const citizensHub = new CitizensHub(steps, section, templatePath, i18next, schema);
            ctx = citizensHub.getContextData(req);
            expect(ctx.documentsReceived).to.equal(true);
            expect(ctx.applicationInReview).to.equal(false);
            expect(ctx.grantIssued).to.equal(false);
            done();
        });
        it('should return the context with case progress for BOReadyToIssue', (done) => {
            req = {
                session: {
                    form: {
                        ccdCase: {
                            id: 1234567890123456,
                            state: 'BOReadyToIssue'
                        },
                        deceased: {
                            firstName: 'Peter',
                            lastName: 'Williams'
                        }
                    }
                }
            };
            const citizensHub = new CitizensHub(steps, section, templatePath, i18next, schema);
            ctx = citizensHub.getContextData(req);
            expect(ctx.documentsReceived).to.equal(true);
            expect(ctx.applicationInReview).to.equal(true);
            expect(ctx.grantIssued).to.equal(false);
            done();
        });
        it('should return the context with case progress for BOGrantIssued', (done) => {
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
            const citizensHub = new CitizensHub(steps, section, templatePath, i18next, schema);
            ctx = citizensHub.getContextData(req);
            expect(ctx.documentsReceived).to.equal(true);
            expect(ctx.applicationInReview).to.equal(true);
            expect(ctx.grantIssued).to.equal(true);
            done();
        });
        it('should return the context with case progress for BOCaseStopped with case type', (done) => {
            req = {
                session: {
                    form: {
                        ccdCase: {
                            id: 1234567890123456,
                            state: 'BOCaseStopped'
                        },
                        caseType: 'gop'
                    }
                }
            };
            const citizensHub = new CitizensHub(steps, section, templatePath, i18next, schema);
            ctx = citizensHub.getContextData(req);
            expect(ctx.documentsReceived).to.equal(true);
            expect(ctx.applicationInReview).to.equal(true);
            expect(ctx.grantIssued).to.equal(false);
            expect(ctx.caseType).to.equal('gop');
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
            const citizensHub = new CitizensHub(steps, section, templatePath, i18next, schema);
            [ctx, formdata] = citizensHub.action(ctx, formdata);
            expect(ctx).to.deep.equal({});
        });
    });

    describe('handleGet()', () => {
        it('test when checkAnswersSummary JSON just exists', () => {
            let ctx = {};
            let formdata = {
                checkAnswersSummary: '{"test":"data"}'
            };
            const citizensHub = new CitizensHub(steps, section, templatePath, i18next, schema);
            [ctx, formdata] = citizensHub.handleGet(ctx, formdata);
            expect(ctx.checkAnswersSummary).to.deep.equal(true);
            expect(ctx.legalDeclaration).to.deep.equal(false);
        });

        it('test when legalDeclaration JSON just exists', () => {
            let ctx = {};
            let formdata = {
                legalDeclaration: '{"test":"data"}'
            };
            const citizensHub = new CitizensHub(steps, section, templatePath, i18next, schema);
            [ctx, formdata] = citizensHub.handleGet(ctx, formdata);
            expect(ctx.checkAnswersSummary).to.deep.equal(false);
            expect(ctx.legalDeclaration).to.deep.equal(true);
        });

        it('test when no pdf variables JSON exists', () => {
            let ctx = {};
            let formdata = {};
            const citizensHub = new CitizensHub(steps, section, templatePath, i18next, schema);
            [ctx, formdata] = citizensHub.handleGet(ctx, formdata);
            expect(ctx.checkAnswersSummary).to.deep.equal(false);
            expect(ctx.legalDeclaration).to.deep.equal(false);
        });

        it('test when all pdf variables JSON exists', () => {
            let ctx = {};
            let formdata = {
                checkAnswersSummary: '{"test":"data"}',
                legalDeclaration: '{"test":"data"}'
            };
            const citizensHub = new CitizensHub(steps, section, templatePath, i18next, schema);
            [ctx, formdata] = citizensHub.handleGet(ctx, formdata);
            expect(ctx.checkAnswersSummary).to.deep.equal(true);
            expect(ctx.legalDeclaration).to.deep.equal(true);
        });

        it('should set documentsRequired to true when documents are required', (done) => {
            const revertDocumentsWrapper = CitizensHub.__set__({
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
            const citizensHub = new CitizensHub(steps, section, templatePath, i18next, schema);
            co(function* () {
                const [ctx] = citizensHub.handleGet({}, {});
                expect(ctx).to.deep.equal(expectedContext);
                revertDocumentsWrapper();
                done();
            }).catch(err => {
                done(err);
            });
        });

        it('should set documentsRequired to false when documents are not required', (done) => {
            const revertDocumentsWrapper = CitizensHub.__set__({
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
            const citizensHub = new CitizensHub(steps, section, templatePath, i18next, schema);
            co(function* () {
                const [ctx] = citizensHub.handleGet({}, {});
                expect(ctx).to.deep.equal(expectedContext);
                revertDocumentsWrapper();
                done();
            }).catch(err => {
                done(err);
            });
        });
    });
});
