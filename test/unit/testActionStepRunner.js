const ActionStepRunner = require('app/core/runners/ActionStepRunner'),
      sinon = require('sinon'),
      chai = require('chai'),
      expect = chai.expect,
      sinonChai = require('sinon-chai');

chai.use(sinonChai);

describe('ActionStepRunner', function () {

    it('Test GET', function () {
        const stepName = 'test';
        const step = {name: stepName};

        const req = {};
        req.log = sinon.spy();
        req.log.error = sinon.spy();
        const res = {};
        res.render = sinon.spy();
        res.status = sinon.spy();

        const runner = new ActionStepRunner();
        runner.handleGet(step, req, res);
        expect(req.log.error).to.have.been.calledWith('GET operation not defined for ' + stepName + ' step');
        expect(res.status).to.have.been.calledWith(404);
        expect(res.render).to.have.been.calledWith('errors/404');

    });
});
