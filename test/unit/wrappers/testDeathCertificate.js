const DeathCertificateWrapper = require('app/wrappers/DeathCertificate');
const expect = require('chai').expect;

describe('DeathCertificate', () => {
    describe('hasInterimDeathCertificate()', () => {
        it('should return true when death certificate is interim', (done) => {
            const data = {deathCertificate: 'optionInterimDeathCertificate'};
            const deathCertificateWrapper = new DeathCertificateWrapper(data);
            expect(deathCertificateWrapper.hasInterimDeathCertificate()).to.equal(true);
            done();
        });

        describe('should return false', () => {
            it('when death certificate is regular', (done) => {
                const data = {deathCertificate: 'optionDeathCertificate'};
                const deathCertificateWrapper = new DeathCertificateWrapper(data);
                expect(deathCertificateWrapper.hasInterimDeathCertificate()).to.equal(false);
                done();
            });

            it('when there is no deathCertificate property', (done) => {
                const data = {};
                const deathCertificateWrapper = new DeathCertificateWrapper(data);
                expect(deathCertificateWrapper.hasInterimDeathCertificate()).to.equal(false);
                done();
            });

            it('when there is no deceased data', (done) => {
                const deathCertificateWrapper = new DeathCertificateWrapper();
                expect(deathCertificateWrapper.hasInterimDeathCertificate()).to.equal(false);
                done();
            });
        });
    });

    describe('hasForeignDeathCertificate()', () => {
        it('should return true when foreign death certificate', (done) => {
            const data = {diedEngOrWales: 'optionNo'};
            const deathCertificateWrapper = new DeathCertificateWrapper(data);
            expect(deathCertificateWrapper.hasForeignDeathCertificate()).to.equal(true);
            done();
        });

        describe('should return false', () => {
            it('when not foreign death certificate', (done) => {
                const data = {diedEngOrWales: 'optionYes'};
                const deathCertificateWrapper = new DeathCertificateWrapper(data);
                expect(deathCertificateWrapper.hasForeignDeathCertificate()).to.equal(false);
                done();
            });

            it('when there is no diedEngOrWales property', (done) => {
                const data = {};
                const deathCertificateWrapper = new DeathCertificateWrapper(data);
                expect(deathCertificateWrapper.hasForeignDeathCertificate()).to.equal(false);
                done();
            });

            it('when there is no deceased data', (done) => {
                const deathCertificateWrapper = new DeathCertificateWrapper();
                expect(deathCertificateWrapper.hasForeignDeathCertificate()).to.equal(false);
                done();
            });
        });
    });

    describe('isForeignDeathCertTranslatedSeparately()', () => {
        it('should return true when foreign death certificate is translated separately', (done) => {
            const data = {foreignDeathCertTranslation: 'optionNo'};
            const deathCertificateWrapper = new DeathCertificateWrapper(data);
            expect(deathCertificateWrapper.isForeignDeathCertTranslatedSeparately()).to.equal(true);
            done();
        });

        describe('should return false', () => {
            it('when foreign death certificate is not translated separately', (done) => {
                const data = {foreignDeathCertTranslation: 'optionYes'};
                const deathCertificateWrapper = new DeathCertificateWrapper(data);
                expect(deathCertificateWrapper.isForeignDeathCertTranslatedSeparately()).to.equal(false);
                done();
            });

            it('when there is no foreignDeathCertTranslation property', (done) => {
                const data = {};
                const deathCertificateWrapper = new DeathCertificateWrapper(data);
                expect(deathCertificateWrapper.isForeignDeathCertTranslatedSeparately()).to.equal(false);
                done();
            });

            it('when there is no deceased data', (done) => {
                const deathCertificateWrapper = new DeathCertificateWrapper();
                expect(deathCertificateWrapper.isForeignDeathCertTranslatedSeparately()).to.equal(false);
                done();
            });
        });
    });
});
