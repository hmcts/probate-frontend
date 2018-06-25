const initSteps = require('app/core/initSteps');
const chai = require('chai');
const assert = chai.assert;
const when = require('when');
const sinon = require('sinon');
const {isNil} = require('lodash');
const services = require('app/components/services');

describe('ExecutorNumber', () => {
    let ctx, removeExecutorStub;
    const ExecNumber = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]).ExecutorsNumber;

    beforeEach(function() {
        removeExecutorStub = sinon.stub(services, 'removeExecutor');
        ctx = {
            executorsRemoved: [
                {'fullName': 'other applicant', 'isApplying': true, 'isApplicant': false, 'inviteId': 'dummy_inviteId'},
                {'fullName': 'harvey', 'isApplying': false, 'isApplicant': false}
            ],
            list: [
                {'fullName': 'john', 'isApplying': true, 'isApplicant': true}
            ],
            executorsNumber: 2,
            invitesSent: 'true'
        };
    });

    afterEach(function() {
        removeExecutorStub.restore();
    });

    it('Removes executors from invitedata table (success)', (done) => {
        removeExecutorStub.returns(when(Promise.resolve()));
        [ctx] = ExecNumber.handlePost(ctx);

        sinon.assert.calledOnce(removeExecutorStub);
        assert.isTrue(isNil(ctx.executorsRemoved));
        done();
    });

    it('Removes executors from invitedata table (failure)', (done) => {
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
