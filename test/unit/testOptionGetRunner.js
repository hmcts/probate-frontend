const OptionGetRunner = require('app/core/runners/OptionGetRunner'),
    sinon = require('sinon'),
    chai = require('chai'),
    expect = chai.expect,
    sinonChai = require('sinon-chai');

chai.use(sinonChai);

describe('OptionGetRunner', function () {

    it('Test POST', function () {
        const step = {name: 'test'};

        const req = {};
        req.log = sinon.spy();
        req.log.error = sinon.spy();
        const res = {};
        res.render = sinon.spy();
        res.status = sinon.spy();

        const runner = new OptionGetRunner();
        runner.handlePost(step, req, res);
        expect(req.log.error).to.have.been.calledWith('Post operation not defined for OptionGetRunner');
        expect(res.status).to.have.been.calledWith(404);
        expect(res.render).to.have.been.calledWith('errors/404');

    });
});
