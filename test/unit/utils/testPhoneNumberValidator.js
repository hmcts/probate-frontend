const PhoneNumberValidator = require('app/utils/PhoneNumberValidator');
const expect = require('chai').expect;

describe('PhoneNumberValidator.js', () => {
    describe('validateUKMobilePhoneNumber()', () => {
        describe('Base Case', () => {
            it('should return true to validate number for testing purposes', (done) => {
                const phoneNumber = '07123456789';
                expect(PhoneNumberValidator.validateMobilePhoneNumber(phoneNumber)).to.equal(true);
                done();
            });
        });

        describe('Length Validation', () => {
            it('should return failure for not meeting minimum length', (done) => {
                const phoneNumber = '020 1234';
                expect(PhoneNumberValidator.validateMobilePhoneNumber(phoneNumber)).to.equal(false);
                done();
            });
            it('should return failure for exceeding maximum length', (done) => {
                const phoneNumber = '020 12345 6789 10 11';
                expect(PhoneNumberValidator.validateMobilePhoneNumber(phoneNumber)).to.equal(false);
                done();
            });
            it('should return true for acceptable length (11 chars)', (done) => {
                const phoneNumber = '07123456789';
                expect(PhoneNumberValidator.validateMobilePhoneNumber(phoneNumber)).to.equal(true);
                done();
            });
            it('should return true for acceptable length (15 chars)', (done) => {
                const phoneNumber = '+4917642010039';
                expect(PhoneNumberValidator.validateMobilePhoneNumber(phoneNumber)).to.equal(true);
                done();
            });
            it('should return false for invalid mobile number', (done) => {
                const phoneNumber = '+179589953302345234';
                expect(PhoneNumberValidator.validateMobilePhoneNumber(phoneNumber)).to.equal(false);
                done();
            });
        });

        describe('Alphanumeric Input Validation', () => {
            it('should return false for invalid input', (done) => {
                const phoneNumber = 'INVALID_INPUT';
                expect(PhoneNumberValidator.validateMobilePhoneNumber(phoneNumber)).to.equal(false);
                done();
            });
            it('should return true for hyphens input', (done) => {
                const phoneNumber = '07-1234-56789';
                expect(PhoneNumberValidator.validateMobilePhoneNumber(phoneNumber)).to.equal(true);
                done();
            });
            it('should return true for spaces input', (done) => {
                const phoneNumber = '07 1234 56789';
                expect(PhoneNumberValidator.validateMobilePhoneNumber(phoneNumber)).to.equal(true);
                done();
            });
            it('should return true for invalid chars', (done) => {
                const phoneNumber = 'abcdef';
                expect(PhoneNumberValidator.validateMobilePhoneNumber(phoneNumber)).to.equal(false);
                done();
            });
        });

        describe('International Number Validation', () => {
            it('should return true for international number (French)', (done) => {
                const phoneNumber = '+33 6 12 34 56 78';
                expect(PhoneNumberValidator.validateMobilePhoneNumber(phoneNumber)).to.equal(true);
                done();
            });
            it('should return pass for overseas mobile number', (done) => {
                const phoneNumber = '+33 7 58 99 53 30';
                expect(PhoneNumberValidator.validateMobilePhoneNumber(phoneNumber)).to.equal(true);
                done();
            });
            it('should return true for British with country code', (done) => {
                const phoneNumber = '+44 7911 123456';
                expect(PhoneNumberValidator.validateMobilePhoneNumber(phoneNumber)).to.equal(true);
                done();
            });
            it('should return false for invalid country code', (done) => {
                const phoneNumber = '+999 6 12 34 56 78';
                expect(PhoneNumberValidator.validateMobilePhoneNumber(phoneNumber)).to.equal(false);
                done();
            });
            it('should return false for missing country code', (done) => {
                const phoneNumber = '+ 6 12 34 56 78';
                expect(PhoneNumberValidator.validateMobilePhoneNumber(phoneNumber)).to.equal(false);
                done();
            });
            it('should return false invalid international number', (done) => {
                const phoneNumber = '+44-7911-12345';
                expect(PhoneNumberValidator.validateMobilePhoneNumber(phoneNumber)).to.equal(false);
                done();
            });
        });

        describe('General Validation Tests', () => {
            it('should return failure for invalid number', (done) => {
                const phoneNumber = '0208 863 8689';
                expect(PhoneNumberValidator.validateMobilePhoneNumber(phoneNumber)).to.equal(false);
                done();
            });
            it('should return failure for uk landline number', (done) => {
                const phoneNumber = '02088638689';
                expect(PhoneNumberValidator.validateMobilePhoneNumber(phoneNumber)).to.equal(false);
                done();
            });
            it('should return failure for invalid uk mobile number', (done) => {
                const phoneNumber = '08958995330';
                expect(PhoneNumberValidator.validateMobilePhoneNumber(phoneNumber)).to.equal(false);
                done();
            });
            it('should return pass for uk mobile number INTL', (done) => {
                const phoneNumber = '+447958995330';
                expect(PhoneNumberValidator.validateMobilePhoneNumber(phoneNumber)).to.equal(true);
                done();
            });
            it('should return pass for uk mobile number', (done) => {
                const phoneNumber = '07958995330';
                expect(PhoneNumberValidator.validateMobilePhoneNumber(phoneNumber)).to.equal(true);
                done();
            });
            //The following are edited tests which failed under previous validation
            it('should return true for spaces', (done) => {
                const phoneNumber = ' 07958995330    ';
                expect(PhoneNumberValidator.validateMobilePhoneNumber(phoneNumber)).to.equal(true);
                done();
            });
            it('should return for uk mobile number INTL staring with 00', (done) => {
                const phoneNumber = '00447958995330';
                expect(PhoneNumberValidator.validateMobilePhoneNumber(phoneNumber)).to.equal(true);
                done();
            });
            it('should return true for spaced format uk mobile number', (done) => {
                const phoneNumber = '+44 7958995330';
                expect(PhoneNumberValidator.validateMobilePhoneNumber(phoneNumber)).to.equal(true);
                done();
            });

        });
    });
});
