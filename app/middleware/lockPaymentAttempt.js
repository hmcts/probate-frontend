'use strict';
const logger = require('app/components/logger')('Init');

const lockPaymentAttempt = (req, res, next) => {
    const session = req.session;
    if (session.paymentLock === 'Locked') {
        logger.info('Ignoring 2nd locking attempt');
        res.sendStatus(204);
    } else {
        logger.info('Locking payment');
        session.paymentLock = 'Locked';
        session.save();
        next();
    }
};

module.exports = lockPaymentAttempt;
