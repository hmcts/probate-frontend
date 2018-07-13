'use strict';

const expect = require('chai').expect;
const FormatUrl = require('app/utils/FormatUrl');

describe('FormatUrl.js', () => {
    describe('format()', () => {
        describe('should return the correct url when given a service url', () => {
            it('with a port', (done) => {
                const serviceUrl = FormatUrl.format('http://localhost:8080');
                expect(serviceUrl).to.equal('http://localhost:8080');
                done();
            });

            it('with no port', (done) => {
                const serviceUrl = FormatUrl.format('http://localhost');
                expect(serviceUrl).to.equal('http://localhost');
                done();
            });

            it('with a new path', (done) => {
                const serviceUrl = FormatUrl.format('http://localhost:8080/validate', '/submit');
                expect(serviceUrl).to.equal('http://localhost:8080/submit');
                done();
            });

            it('with the original path', (done) => {
                const serviceUrl = FormatUrl.format('http://localhost:8080/validate');
                expect(serviceUrl).to.equal('http://localhost:8080/validate');
                done();
            });
        });
    });
});
