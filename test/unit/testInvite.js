'use strict';
const chai = require('chai'),
    sinon = require('sinon'),
    expect = chai.expect,
    InviteLink = require('app/invite.js'),
    services = require('app/components/services');

describe('Executors invite endpoints', function () {
    let req, res, next, findInviteLinkStub, sendPinStub, checkAllAgreedStub, invite;

    beforeEach(function () {
        req = {session: {},
            params: {inviteId: 123}}
        res = {redirect: sinon.spy(), status: sinon.spy(), render: sinon.spy()}
        next = sinon.spy()
        invite = new InviteLink()
        findInviteLinkStub = sinon.stub(services, 'findInviteLink')
        checkAllAgreedStub = sinon.stub(services, 'checkAllAgreed')
        sendPinStub = sinon.stub(services, 'sendPin')
    });

    afterEach(function () {
        findInviteLinkStub.restore()
        sendPinStub.restore()
        checkAllAgreedStub.restore()
    })

    it('when there is a valid link', function (pass) {
        findInviteLinkStub.returns(Promise.resolve({valid: true}))
        sendPinStub.returns(Promise.resolve('1234'))

        invite.verify()(req, res, next)

        checkAsync(() => {
            sinon.assert.calledOnce(res.redirect);
            expect(res.redirect).to.have.been.calledWith('/sign-in')
            pass()
        })
    })

    it('when there is an invalid link', function (pass) {
        findInviteLinkStub.returns(Promise.reject(new Error('Invalid link')))

        invite.verify()(req, res, next)

        checkAsync(() => {
            sinon.assert.calledOnce(res.redirect)
            expect(res.redirect).to.have.been.calledWith('/errors/404')
            pass()
        })
    })


    it('when the co-applicant accesses the link directly it should be redirected to not found page', function (pass) {

        invite.checkCoApplicant('true')(req, res, next)

        checkAsync(() => {
            expect(res.render).to.have.been.calledWith('errors/404')
            pass()
        })
    })

    it('when the co-applicant accesses the link through the invite link it should be redirected the sign in page', function (pass) {
        req.session.inviteId = 'validId'
        checkAllAgreedStub.returns(Promise.resolve('false'))


        invite.checkCoApplicant('true')(req, res, next)

        checkAsync(() => {
            sinon.assert.calledOnce(next)
            pass()
        })
    })

    function checkAsync(callback) {
        setTimeout(function () {
            callback();
        }, 50);
    }
})