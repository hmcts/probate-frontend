const sinon = require('sinon');

const commonReq = {
    session: {
        form: {}
    },
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'testToken',
    },
    get: sinon.stub()
};

const commonRes = {
    send: sinon.stub(),
    set: sinon.stub(),
    sendStatus: sinon.stub(),
    redirect: sinon.stub()
};

const commonNext = sinon.stub();

module.exports = {
    commonReq,
    commonRes,
    commonNext
};
