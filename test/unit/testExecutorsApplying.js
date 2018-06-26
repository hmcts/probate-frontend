const initSteps = require('app/core/initSteps');
const when = require('when');
const sinon = require('sinon');
const services = require('app/components/services');
const json = require('app/resources/en/translation/executors/applying.json');

describe('ExecutorsApplying', () => {
    let ctx, removeExecutorStub;
    const ExecApplying = initSteps([`${__dirname}/../../app/steps/action/`, `${__dirname}/../../app/steps/ui`]).ExecutorsApplying;

    beforeEach(function () {
        removeExecutorStub = sinon.stub(services, 'removeExecutor');
        ctx = {
            executorsInvitedList: [
                {'fullName': 'other applicant', 'isApplying': true, 'isApplicant': false, 'inviteId': 'dummy_inviteId_1'},
                {'fullName': 'harvey', 'isApplying': true, 'isApplicant': false, 'inviteId': 'dummy_inviteId_2'}
            ],
            executorsNumber: 3,
            invitesSent: 'true'
        };
    });

    afterEach(function () {
        removeExecutorStub.restore();
    });

    it('Removes executors from invitedata table when Executors applying is No (success)', () => {
        removeExecutorStub.returns(when(Promise.resolve({name: 'success!'})));
        [ctx] = ExecApplying.handlePost(ctx, json.optionNo);
        sinon.assert.called(removeExecutorStub);
    });
});
