const DocumentsWrapper = require('app/wrappers/Documents');
const chai = require('chai');
const expect = chai.expect;

describe('Documents.js', () => {
    describe('registryAddress()', () => {
        it('should return the address when an address is available', (done) => {
            const data = {registryAddress: 'Test Address Line 1\nTest Address Line 2\nTest Address Postcode'};
            const documentsWrapper = new DocumentsWrapper(data);
            expect(documentsWrapper.registryAddress()).to.equal(data.registryAddress);
            done();
        });

        describe('should return an empty string', () => {
            it('when there is no address property', (done) => {
                const data = {};
                const documentsWrapper = new DocumentsWrapper(data);
                expect(documentsWrapper.registryAddress()).to.equal('');
                done();
            });

            it('when there is no documents data', (done) => {
                const documentsWrapper = new DocumentsWrapper();
                expect(documentsWrapper.registryAddress()).to.equal('');
                done();
            });
        });
    });
});
