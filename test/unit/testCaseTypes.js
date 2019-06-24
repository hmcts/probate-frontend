'use strict';

const expect = require('chai').expect;
const caseTypes = require('app/utils/CaseTypes');

describe('caseTypes', () => {
    describe('isIntestacyCaseType()', () => {
        it('should return false if session.caseType and session.form.caseType are not set', (done) => {
            const session = {};
            const isIntestacyCaseType = caseTypes.isIntestacyCaseType(session);
            expect(isIntestacyCaseType).to.equal(false);
            done();
        });

        it('should return false if session.caseType is set to \'gop\'', (done) => {
            const session = {
                caseType: caseTypes.GOP
            };
            const isIntestacyCaseType = caseTypes.isIntestacyCaseType(session);
            expect(isIntestacyCaseType).to.equal(false);
            done();
        });

        it('should return false if session.form.caseType is set to \'gop\'', (done) => {
            const session = {
                form: {
                    caseType: caseTypes.GOP
                }
            };
            const isIntestacyCaseType = caseTypes.isIntestacyCaseType(session);
            expect(isIntestacyCaseType).to.equal(false);
            done();
        });

        it('should return true if session.caseType is set to \'intestacy\'', (done) => {
            const session = {
                caseType: caseTypes.INTESTACY
            };
            const isIntestacyCaseType = caseTypes.isIntestacyCaseType(session);
            expect(isIntestacyCaseType).to.equal(true);
            done();
        });

        it('should return true if session.form.caseType is set to \'intestacy\'', (done) => {
            const session = {
                form: {
                    caseType: caseTypes.INTESTACY
                }
            };
            const isIntestacyCaseType = caseTypes.isIntestacyCaseType(session);
            expect(isIntestacyCaseType).to.equal(true);
            done();
        });
    });

    describe('setCaseTypeFormdata()', () => {
        it('should return the original session if session.caseType does not exist', (done) => {
            const sessionToTest = {
                form: {}
            };
            const session = caseTypes.setCaseTypeFormdata(sessionToTest);
            expect(session).to.deep.equal({
                form: {}
            });
            done();
        });

        it('should add session.caseType to the form data if session.caseType exists and session.caseType does not exist', (done) => {
            const sessionToTest = {
                form: {},
                caseType: caseTypes.GOP
            };
            const session = caseTypes.setCaseTypeFormdata(sessionToTest);
            expect(session).to.deep.equal({
                form: {
                    caseType: caseTypes.GOP
                },
                caseType: caseTypes.GOP
            });
            done();
        });

        it('should add session.caseType to the form data if session.caseType exists and session.form.caseType does not exist', (done) => {
            const sessionToTest = {
                form: {},
                caseType: caseTypes.GOP
            };
            const session = caseTypes.setCaseTypeFormdata(sessionToTest);
            expect(session).to.deep.equal({
                form: {
                    caseType: caseTypes.GOP
                },
                caseType: caseTypes.GOP
            });
            done();
        });

        it('should not add session.caseType to the form data if session.caseType exists and session.form.caseType exists', (done) => {
            const sessionToTest = {
                form: {
                    caseType: caseTypes.GOP
                },
                caseType: caseTypes.GOP
            };
            const session = caseTypes.setCaseTypeFormdata(sessionToTest);
            expect(session).to.deep.equal({
                form: {
                    caseType: caseTypes.GOP
                },
                caseType: caseTypes.GOP
            });
            done();
        });
    });

    describe('getCaseTypeName()', () => {
        it('should return \'gop\' if session.caseType and session.form.caseType are not set', (done) => {
            const session = {};
            const caseType = caseTypes.getCaseType(session);
            expect(caseType).equal(caseTypes.GOP);
            done();
        });

        it('should return \'gop\' as journey name if session.caseType is set to \'gop\'', (done) => {
            const session = {
                caseType: caseTypes.GOP
            };
            const caseType = caseTypes.getCaseType(session);
            expect(caseType).to.equal(caseTypes.GOP);
            done();
        });

        it('should return \'gop\' as journey name if session.form.caseType is set to \'gop\'', (done) => {
            const session = {
                form: {
                    caseType: caseTypes.GOP
                }
            };
            const caseType = caseTypes.getCaseType(session);
            expect(caseType).to.equal(caseTypes.GOP);
            done();
        });

        it('should return \'intestacy\' if session.caseType is set to \'intestacy\'', (done) => {
            const session = {
                caseType: caseTypes.INTESTACY
            };
            const caseType = caseTypes.getCaseType(session);
            expect(caseType).to.equal(caseTypes.INTESTACY);
            done();
        });

        it('should return \'intestacy\' if session.form.caseType is set to \'intestacy\'', (done) => {
            const session = {
                form: {
                    caseType: caseTypes.INTESTACY
                }
            };
            const caseType = caseTypes.getCaseType(session);
            expect(caseType).to.equal(caseTypes.INTESTACY);
            done();
        });
    });
});
