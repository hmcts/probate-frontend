const setServiceAuthorisationToken = require('../../../app/middleware/setServiceAuthorisationToken');
const {commonReq, commonRes, commonNext} = require('../../util/commonConsts');
const sinon = require('sinon');
const ServiceAuthoriser = require('../../../app/utils/ServiceAuthoriser');
const {expect} = require('chai');

describe('setServiceAuthorisationToken', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = commonReq;
        res = commonRes;
        next = commonNext;
    });

    it('then', () => {
        const determineServiceAuthorizationTokenStub = sinon.stub(ServiceAuthoriser.prototype, 'determineServiceAuthorizationToken')
            .returns(Promise.resolve('setServiceAuthorisationTokenTestToken'));
        setServiceAuthorisationToken(req, res, next);

        setTimeout(() => {
            sinon.assert.calledOnce(determineServiceAuthorizationTokenStub);
            sinon.assert.calledOnce(next);
            expect(req.session.serviceAuthorization).to.equal('setServiceAuthorisationTokenTestToken');

            determineServiceAuthorizationTokenStub.restore();
        });
    });
});
