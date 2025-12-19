'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const lockPaymentAttemptMiddleware = require('app/middleware/lockPaymentAttempt');

describe('lockPaymentAttemptMiddleware', () => {
    describe('lockPaymentAttempt', () => {
        let req;
        let res;
        let next;

        beforeEach(() => {
            res = {};
            next = sinon.spy();
        });

        it('should return 204 if session locked', (done) => {
            req = {
                session: {
                    save: () => true,
                    paymentLock: 'Locked'
                }
            };
            res = Object.assign(res, {
                sendStatus: sinon.spy()
            });
            lockPaymentAttemptMiddleware(req, res, next);
            expect(res.sendStatus.calledWith(204)).to.equal(true);
            expect(req.session.paymentLock).to.equal('Locked');
            expect(next.calledOnce).to.equal(false);
            done();
        });

        it('should lock payment if unlocked', (done) => {
            req.session = {
                save: sinon.spy()
            };
            lockPaymentAttemptMiddleware(req, res, next);
            expect(req.session.paymentLock).to.equal('Locked');
            expect(req.session.save.calledOnce).to.equal(true);
            expect(next.calledOnce).to.equal(true);
            done();
        });
    });
});
