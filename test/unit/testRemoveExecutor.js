const chai = require('chai');
const assert = chai.assert;
const when = require('when');
const sinon = require('sinon');
const services = require('app/components/services');

describe('RemoveExecutor', () => {
    let removeExecutorStub;

    beforeEach(function () {
        removeExecutorStub = sinon.stub(services, 'removeExecutor');
    });

    afterEach(function () {
        removeExecutorStub.restore();
    });

    it('Removes executors from invitedata table (failure)', (done) => {
        removeExecutorStub.withArgs('invite_id').returns(Promise.resolve({name: 'success!'}));

        services.removeExecutor('invite_id').then(result => {
            sinon.assert.calledOnce(removeExecutorStub);
            assert.strictEqual(result.name, 'success!');
            done();
        });
    });

    it('Removes executors from invitedata table (failure)', (done) => {
    const expectedError = new Error('Error while deleting executor from invitedata table.');
    removeExecutorStub.returns(when(expectedError));

        services.removeExecutor('invalid_id').then((actualError) => {
            sinon.assert.alwaysCalledWith(removeExecutorStub, 'invalid_id');
            assert.strictEqual(expectedError, actualError);
            done();
        })
        .catch(done);
    });
});
