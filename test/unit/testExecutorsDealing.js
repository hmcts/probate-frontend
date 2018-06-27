const initSteps = require('app/core/initSteps');
const when = require('when');
const sinon = require('sinon');
const services = require('app/components/services');

describe('ExecutorsDealingWithEstate', () => {
    let ctx;
    let removeExecutorStub;
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

    it('Removes executors from invitedata table when they are no longer dealing with the estate', () => {
        removeExecutorStub.returns(when(Promise.resolve({name: 'success!'})));
        [ctx] = ExecDealing.handlePost(ctx);
        sinon.assert.called(removeExecutorStub);
    });
});
