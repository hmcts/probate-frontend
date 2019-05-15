'use strict';

const router = require('express').Router();
const lockPaymentAttempt = require('app/middleware/lockPaymentAttempt');

router.post(
    '/', lockPaymentAttempt
);

module.exports = router;
