'use strict';

const CaseProgress = require('app/utils/CaseProgress.cjs');
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
        it('should return true for BOGrantIssued', (done) => {
            const state = 'BOPostGrantIssued';
            expect(CaseProgress.grantIssued(state)).to.equal(true);
            done();
        });
    });

    describe('informationProvided()', () => {
        it('should return true for informationProvided', (done) => {
            const state = 'BOCaseStopped';
            const documentUploadIssue = 'false';
            const expectedResponseDate = '2024-12-11';
            expect(CaseProgress.informationProvided(state, documentUploadIssue, expectedResponseDate)).to.equal(true);
            done();
        });
        it('should return false for informationProvided', (done) => {
            const state = 'BOCaseStopped';
            const documentUploadIssue = 'false';
            expect(CaseProgress.informationProvided(state, documentUploadIssue)).to.equal(false);
            done();
        });
    });

    describe('partialInformationProvided()', () => {
        it('should return true for partialInformationProvided', (done) => {
            const state = 'BOCaseStopped';
            const documentUploadIssue = 'true';
            expect(CaseProgress.partialInformationProvided(state, documentUploadIssue)).to.equal(true);
            done();
        });
        it('should return true for partialInformationProvided', (done) => {
            const state = 'BOCaseStopped';
            const documentUploadIssue = 'true';
            const expectedResponseDate = '2024-12-11';
            expect(CaseProgress.partialInformationProvided(state, documentUploadIssue, expectedResponseDate)).to.equal(true);
            done();
        });
        it('should return true for partialInformationProvided', (done) => {
            const state = 'Dormant';
            const documentUploadIssue = 'true';
            const expectedResponseDate = null;
            const citizenResponse = '';
            const uploadedDocuments = [];
            expect(CaseProgress.partialInformationProvided(state, documentUploadIssue, expectedResponseDate, citizenResponse, uploadedDocuments)).to.equal(true);
            done();
        });
        it('should return false for partialInformationProvided', (done) => {
            const state = 'BOCaseStopped';
            const documentUploadIssue = null;
            const expectedResponseDate = '2024-12-11';
            const citizenResponse = 'something';
            const uploadedDocuments = ['screenshot1.png', 'screenshot2.png'];
            const isSaveAndClose = 'false';
            expect(CaseProgress.partialInformationProvided(state, documentUploadIssue, expectedResponseDate, citizenResponse, uploadedDocuments, isSaveAndClose)).to.equal(false);
            done();
        });
    });

    describe('caseStopped()', () => {
        it('should return true for BOCaseStopped', (done) => {
            const state = 'BOCaseStopped';
            expect(CaseProgress.caseStopped(state)).to.equal(true);
            done();
        });
        it('should return true for Dormant', (done) => {
            const state = 'Dormant';
            expect(CaseProgress.caseStopped(state)).to.equal(true);
            done();
        });
        it('should return false for BOCaseStoppedReissue', (done) => {
            const state = 'BOCaseStoppedReissue';
            expect(CaseProgress.caseStopped(state)).to.equal(false);
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
