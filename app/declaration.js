'use strict';

const router = require('express').Router();
const RemoveInvitedExecutor = require('app/utils/RemoveInvitedExecutor');

router.post('/', (req, res, next) => {
    RemoveInvitedExecutor.remove(req.session.form.executors).then(result => {
        req.session.form.executors = result;
        next();
    });
});

module.exports = router;
