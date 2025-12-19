'use strict';

const router = require('express').Router();
const AdditionalExecutorInvite = require('app/utils/AdditionalExecutorInvite.cjs');

router.post('/', (req, res, next) => {
    AdditionalExecutorInvite.invite(req)
        .then(result => {
            req.session.form.executors = result;
            next();
        })
        .catch(err => {
            next(err);
        });
});

module.exports = router;
