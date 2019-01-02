'use strict';

const {expect} = require('chai');
const sinon = require('sinon');
const rewire = require('rewire');
const InviteLink = rewire('app/invite');

describe('Executors invite endpoints', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            session: {
                form: {
                    journeyType: 'probate'
                }
            },
            params: {
                inviteId: 123
            }
        };
        res = {
            redirect: sinon.spy(),
            status: sinon.spy(),
            render: sinon.spy()
        };
        next = sinon.spy();
    });

    it('when there is a valid link', (done) => {
        const restore = InviteLink.__set__({
            InviteLinkService: class {
                get() {
                    return Promise.resolve({valid: true});
                }
            },
            PinNumber: class {
                get() {
                    return Promise.resolve('1234');
                }
            }
        });
        const inviteLink = new InviteLink();

        inviteLink.verify()(req, res, next);

        checkAsync(() => {
            sinon.assert.calledOnce(res.redirect);
            expect(res.redirect).to.have.been.calledWith('/sign-in');
            restore();
            done();
        });
    });

    it('when there is an invalid link', (done) => {
        const restore = InviteLink.__set__('InviteLinkService', class {
            get() {
                return Promise.reject(new Error('Invalid link'));
            }
        });
        const inviteLink = new InviteLink();

        inviteLink.verify()(req, res, next);

        checkAsync(() => {
            sinon.assert.calledOnce(res.redirect);
            expect(res.redirect).to.have.been.calledWith('/errors/404');
            restore();
            done();
        });
    });

    it('when the co-applicant accesses the link directly it should be redirected to not found page', (done) => {
        const inviteLink = new InviteLink();

        inviteLink.checkCoApplicant('true')(req, res, next);

        checkAsync(() => {
            expect(res.render).to.have.been.calledWith('errors/404');
            done();
        });
    });

    it('when the co-applicant accesses the link through the invite link it should be redirected the sign in page', (done) => {
        req.session.inviteId = 'validId';

        const restore = InviteLink.__set__('AllExecutorsAgreed', class {
            get() {
                return Promise.resolve('false');
            }
        });
        const inviteLink = new InviteLink();

        inviteLink.checkCoApplicant('true')(req, res, next);

        checkAsync(() => {
            sinon.assert.calledOnce(next);
            restore();
            done();
        });
    });

    const checkAsync = (callback) => {
        setTimeout(() => {
            callback();
        }, 50);
    };
});
