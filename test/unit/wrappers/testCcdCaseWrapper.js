'use strict';

const CcdCaseWrapper = require('app/wrappers/CcdCase');
const expect = require('chai').expect;

describe('CcdCase.js', () => {
    describe('applicationSubmitted()', () => {
        it('should return true if the application has been submitted', (done) => {
            const data = {state: 'CasePrinted'};
            const ccdCaseWrapper = new CcdCaseWrapper(data);
            expect(ccdCaseWrapper.applicationSubmitted()).to.equal(true);
            done();
        });

        it('should return false if the application has not been submitted', (done) => {
            const data = {state: 'Pending'};
            const ccdCaseWrapper = new CcdCaseWrapper(data);
            expect(ccdCaseWrapper.applicationSubmitted()).to.equal(false);
            done();
        });

        it('should return false if the application has not been submitted with state PAAppCreated', (done) => {
            const data = {state: 'PAAppCreated'};
            const ccdCaseWrapper = new CcdCaseWrapper(data);
            expect(ccdCaseWrapper.applicationSubmitted()).to.equal(false);
            done();
        });

        it('should return false if the application has not been submitted with state PAAppCreated', (done) => {
            const data = {state: 'CasePaymentFailed'};
            const ccdCaseWrapper = new CcdCaseWrapper(data);
            expect(ccdCaseWrapper.applicationSubmitted()).to.equal(false);
            done();
        });

        it('should return true if the application has been submitted with case worker printing the case', (done) => {
            const data = {state: 'CasePrinted'};
            const ccdCaseWrapper = new CcdCaseWrapper(data);
            expect(ccdCaseWrapper.applicationSubmitted()).to.equal(true);
            done();
        });
    });
});
