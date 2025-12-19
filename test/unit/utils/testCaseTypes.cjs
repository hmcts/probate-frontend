'use strict';

const expect = require('chai').expect;
const caseTypes = require('app/utils/CaseTypes');

describe('caseTypes', () => {
    describe('isIntestacyCaseType()', () => {
        it('should return false session.form.caseType not set', (done) => {
            const session = {};
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
        it('should add session.form.caseType to the form data if session.form.caseType does not exist', (done) => {
            const sessionToTest = {
                form: {},
            };
            const session = caseTypes.setCaseTypeFormdata(sessionToTest);
            expect(session).to.deep.equal({
                form: {
                    caseType: caseTypes.GOP
                },
            });
            done();
        });

    });

    describe('getCaseTypeName()', () => {
        it('should return \'gop\' if session.form.caseType not set', (done) => {
            const session = {};
            const caseType = caseTypes.getCaseType(session);
            expect(caseType).equal(caseTypes.GOP);
            done();
        });

        it('should return \'gop\' as caseType if session.form.caseType is set to \'gop\'', (done) => {
            const session = {
                form: {
                    caseType: caseTypes.GOP
                }
            };
            const caseType = caseTypes.getCaseType(session);
            expect(caseType).to.equal(caseTypes.GOP);
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
