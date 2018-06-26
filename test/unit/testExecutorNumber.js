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

    it('Removes executors from invitedata table (success)', () => {
        removeExecutorStub.returns(when(Promise.resolve()));
        [ctx] = ExecNumber.handlePost(ctx);
        sinon.assert.calledOnce(removeExecutorStub);
    });
});
