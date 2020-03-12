'use strict';

const checkJourneyType = (caseType, req, res, next) => {
    if (req.session.form.type === caseType) {
        next();
    } else {
        res.redirect('/task-list');
    }
};

module.exports = checkJourneyType;
