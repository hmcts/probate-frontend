'use strict';

const CaseProgress = require('app/utils/CaseProgress');
const expect = require('chai').expect;

describe('CaseProgress.js', () => {
    describe('applicationSubmitted()', () => {
        it('should return false for Pending', (done) => {
            const state = 'Pending';
            expect(CaseProgress.applicationSubmitted(state)).to.equal(false);
            done();
        });
        it('should return false for PAAppCreated', (done) => {
            const state = 'PAAppCreated';
            expect(CaseProgress.applicationSubmitted(state)).to.equal(false);
            done();
        });
        it('should return false for CasePaymentFailed', (done) => {
            const state = 'CasePaymentFailed';
            expect(CaseProgress.applicationSubmitted(state)).to.equal(false);
            done();
        });
        it('should return true for CasePrinted', (done) => {
            const state = 'CasePrinted';
            expect(CaseProgress.applicationSubmitted(state)).to.equal(true);
            done();
        });
    });

    describe('grantIssued()', () => {
        it('should return false for CasePrinted', (done) => {
            const state = 'CasePrinted';
            expect(CaseProgress.grantIssued(state)).to.equal(false);
            done();
        });
        it('should return false for BOReadyToIssue', (done) => {
            const state = 'BOReadyToIssue';
            expect(CaseProgress.grantIssued(state)).to.equal(false);
            done();
        });
        it('should return true for BOGrantIssued', (done) => {
            const state = 'BOGrantIssued';
            expect(CaseProgress.grantIssued(state)).to.equal(true);
            done();
        });
    });

    describe('applicationInReview()', () => {
        it('should return false for Pending', (done) => {
            const state = 'Pending';
            expect(CaseProgress.applicationInReview(state)).to.equal(false);
            done();
        });
        it('should return false for CasePrinted', (done) => {
            const state = 'CasePrinted';
            expect(CaseProgress.applicationInReview(state)).to.equal(false);
            done();
        });
        it('should return true for BOReadyToIssue', (done) => {
            const state = 'BOReadyToIssue';
            expect(CaseProgress.applicationInReview(state)).to.equal(true);
            done();
        });
        it('should return true for BOGrantIssued', (done) => {
            const state = 'BOGrantIssued';
            expect(CaseProgress.applicationInReview(state)).to.equal(true);
            done();
        });
    });

    describe('documentsReceived()', () => {
        let documentsReceivedNotificationSent = '';
        it('should return false for Pending', (done) => {
            const state = 'Pending';
            expect(CaseProgress.documentsReceived(state, documentsReceivedNotificationSent)).to.equal(false);
            done();
        });
        it('should return false for CasePrinted and notification not sent', (done) => {
            const state = 'CasePrinted';
            expect(CaseProgress.documentsReceived(state, documentsReceivedNotificationSent)).to.equal(false);
            done();
        });
        it('should return true for CasePrinted and notification not sent', (done) => {
            const state = 'CasePrinted';
            documentsReceivedNotificationSent = 'true';
            expect(CaseProgress.documentsReceived(state, documentsReceivedNotificationSent)).to.equal(true);
            done();
        });
        it('should return true for BOReadyToIssue', (done) => {
            const state = 'BOReadyToIssue';
            expect(CaseProgress.documentsReceived(state, documentsReceivedNotificationSent)).to.equal(true);
            done();
        });
        it('should return true for BOGrantIssued', (done) => {
            const state = 'BOGrantIssued';
            expect(CaseProgress.documentsReceived(state, documentsReceivedNotificationSent)).to.equal(true);
            done();
        });
    });
});
