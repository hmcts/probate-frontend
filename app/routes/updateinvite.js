'use strict';

const router = require('express').Router();
const UpdateExecutorInvite = require('app/utils/UpdateExecutorInvite');

router.post('/', (req, res, next) => {
    UpdateExecutorInvite.update(req.session)
        .then(result => {
            req.session.form.executors = result;
            delete req.session.form.executors.hasEmailChanged;
            next();
        })
        .catch(err => {
            next(err);
        });
});

module.exports = router;
