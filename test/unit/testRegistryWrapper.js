const RegistryWrapper = require('app/wrappers/Registry');
const expect = require('chai').expect;

describe('Registry.js', () => {
    describe('address()', () => {
        it('should return the address when an address is available', (done) => {
            const data = {address: 'Test Address Line 1\nTest Address Line 2\nTest Address Postcode'};
            const registryWrapper = new RegistryWrapper(data);
            expect(registryWrapper.address()).to.equal(data.address);
            done();
        });

        describe('should return an empty string', () => {
            it('when there is no address property', (done) => {
                const data = {};
                const registryWrapper = new RegistryWrapper(data);
                expect(registryWrapper.address()).to.equal('');
                done();
            });

            it('when there is no documents data', (done) => {
                const registryWrapper = new RegistryWrapper();
                expect(registryWrapper.address()).to.equal('');
                done();
            });
        });
    });
});
