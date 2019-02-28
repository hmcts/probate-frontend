'use strict';

const config = require('app/config');
const FeesCalculator = require('app/utils/FeesCalculator');

const calculatePaymentFees = (req, res, next) => {
    const session = req.session;
    const formdata = session.form;
    const feesCalculator = new FeesCalculator(config.services.feesRegister.url, session.id);

    feesCalculator.calc(formdata, req.authToken)
        .then((fees) => {
            formdata.fees = fees;
            session.form = formdata;
            next();
        });
};

module.exports = calculatePaymentFees;
