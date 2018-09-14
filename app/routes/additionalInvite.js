'use strict';

const router = require('express').Router();
const AdditionalExecutorInvite = require('app/utils/AdditionalExecutorInvite');

router.post('/', (req, res, next) => {
    AdditionalExecutorInvite.invite(req.session).then(result => {
        req.session.form.executors = result;
        next();
    })
        .catch(err => {
            next(err);
        });
});

module.exports = router;
