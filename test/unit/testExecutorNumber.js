const initSteps = require('app/core/initSteps');
const when = require('when');
const sinon = require('sinon');
const services = require('app/components/services');

describe('ExecutorNumber', () => {
    let ctx, removeExecutorStub;
    const ExecNumber = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]).ExecutorsNumber;

    beforeEach(function() {
        removeExecutorStub = sinon.stub(services, 'removeExecutor');
        ctx = {
            executorsRemoved: [
                {'fullName': 'other applicant', 'isApplying': true, 'isApplicant': false, 'inviteId': 'dummy_inviteId_1'},
                {'fullName': 'harvey', 'isApplying': true, 'isApplicant': false, 'inviteId': 'dummy_inviteId_2'}
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

    it('Removes executors from invitedata table when number of executors is reduced (success)', () => {
        removeExecutorStub.returns(when(Promise.resolve()));
        [ctx] = ExecNumber.handlePost(ctx);
        sinon.assert.calledTwice(removeExecutorStub);
    });
});
