'use strict';

const config = require('config');
const FeesCalculator = require('app/utils/FeesCalculator.cjs');

const calculatePaymentFees = (req, res, next) => {
    const session = req.session;
    const formdata = session.form;
    const feesCalculator = new FeesCalculator(config.services.feesRegister.url, session.id);

    feesCalculator.calc(formdata, req.authToken, req.session.featureToggles)
        .then((fees) => {
            session.form.fees = fees;
            next();
        });
};

module.exports = calculatePaymentFees;
