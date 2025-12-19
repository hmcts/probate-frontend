'use strict';

const expect = require('chai').expect;
const ServiceAuthoriser = require('app/utils/ServiceAuthoriser');
const sinon = require('sinon');
const Service = require('app/services/Service');
let serviceAuthoriser;
let fetchTextStub;

describe('ServiceAuthoriser', () => {
    describe('determineServiceAuthorizationToken()', () => {
        beforeEach(() => {
            serviceAuthoriser = new ServiceAuthoriser('http://localhost', 'dummyId');
            fetchTextStub = sinon.stub(Service.prototype, 'fetchText');
        });

        afterEach(() => {
            fetchTextStub.restore();
        });

        it('should return service authorisation token', (done) => {
            fetchTextStub.returns(Promise.resolve('token'));
            serviceAuthoriser.determineServiceAuthorizationToken()
                .then((res) => {
                    expect(res).to.deep.equal('token');
                    done();
                });
        });
    });
});
