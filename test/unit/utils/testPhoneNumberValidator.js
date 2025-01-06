const PhoneNumberValidator = require('app/utils/PhoneNumberValidator');
const expect = require('chai').expect;

describe('PhoneNumberValidator.js', () => {
    describe('validateUKMobilePhoneNumber()', () => {
        it('should return failure for invalid number', (done) => {
            const phoneNumber = '0208 863 8689';
            expect(PhoneNumberValidator.validateMobilePhoneNumber(phoneNumber)).to.equal(false);
            done();
        });
        it('should return failure for invalid chars', (done) => {
            const phoneNumber = 'abcdef';
            expect(PhoneNumberValidator.validateMobilePhoneNumber(phoneNumber)).to.equal(false);
            done();
        });
        // should it?
        // it('should return failure for invalid spces', (done) => {
        //     const phoneNumber = ' 07958995330';
        //     expect(PhoneNumberValidator.validateMobilePhoneNumber(phoneNumber)).to.equal(false);
        //     done();
        // });
        it('should return failure for uk landline number', (done) => {
            const phoneNumber = '02088638689';
            expect(PhoneNumberValidator.validateMobilePhoneNumber(phoneNumber)).to.equal(false);
            done();
        });
        // why?
        // it('should return fail for uk mobile number INTL staring with 00', (done) => {
        //     const phoneNumber = '00447958995330';
        //     expect(PhoneNumberValidator.validateMobilePhoneNumber(phoneNumber)).to.equal(false);
        //     done();
        // });
        // why?
        // it('should return failure for bad format uk mobile number', (done) => {
        //     const phoneNumber = '+44 7958995330';
        //     expect(PhoneNumberValidator.validateMobilePhoneNumber(phoneNumber)).to.equal(false);
        //     done();
        // });
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
        it('should return pass for overseas mobile number', (done) => {
            const phoneNumber = '+33 7 58 99 53 30';
            expect(PhoneNumberValidator.validateMobilePhoneNumber(phoneNumber)).to.equal(true);
            done();
        });
        it('should return pass for uk mobile number', (done) => {
            const phoneNumber = '07958995330';
            expect(PhoneNumberValidator.validateMobilePhoneNumber(phoneNumber)).to.equal(true);
            done();
        });
        // this isn't a valid phone number
        // it('should return pass for international mobile number', (done) => {
        //     const phoneNumber = '+179589953302345234';
        //     expect(PhoneNumberValidator.validateMobilePhoneNumber(phoneNumber)).to.equal(true);
        //     done();
        // });

    });
});
