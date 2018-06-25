const initSteps = require('app/core/initSteps');
const chai = require('chai');
const assert = chai.assert;
const when = require('when');
const sinon = require('sinon');
const services = require('app/components/services');

describe('ExecutorsDealingWithEstate', () => {
    let ctx, removeExecutorStub;
    const ExecDealing = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]).ExecutorsDealingWithEstate;

    beforeEach(function () {
        removeExecutorStub = sinon.stub(services, 'removeExecutor');
        ctx = {
            list: [
                {'fullName': 'john', 'isApplying': true, 'isApplicant': true},
                {'fullName': 'other applicant', 'isApplying': true, 'isApplicant': false, 'inviteId': 'dummy_inviteId_1'},
                {'fullName': 'harvey', 'isApplying': true, 'isApplicant': true, 'inviteId': 'dummy_inviteId_2'}
            ],
            executorsNumber: 3,
            invitesSent: 'true'
        };
    });

    afterEach(function () {
        removeExecutorStub.restore();
    });

    it('Removes executors from invitedata table when they are no longer dealing with the estate (success)', () => {
        removeExecutorStub.returns(when(Promise.resolve({name: 'success!'})));
        [ctx] = ExecDealing.handlePost(ctx);

        sinon.assert.calledOnce(removeExecutorStub);
    });

    it('Removes executors from invitedata table when they are no longer dealing with the estate (failure)', (done) => {
        const expectedError = new Error('Error while deleting executor from invitedata table.');
        removeExecutorStub.returns(when(expectedError));

        services.removeExecutor('invalid_id')
            .then(function(actualError) {
                sinon.assert.alwaysCalledWith(removeExecutorStub, 'invalid_id');
                assert.strictEqual(expectedError, actualError);
                done();
            })
            .catch(done);
    });
});
