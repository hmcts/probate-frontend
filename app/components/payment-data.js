'use strict';

const config = require('app/config');
const {get, defaultTo} = require('lodash');
const simpleRandom = require('simple-random');
const logger = require('app/components/logger')('Init');

const createCaseReference = (deceasedLastName) => {
    let identifier = defaultTo(deceasedLastName, '');
    identifier = identifier.replace(/[^a-zA-Z]/g, '');
    identifier = identifier.substring(0, 28);
    const suffix = simpleRandom({letters: false, length: 4});
    identifier += suffix;
    return identifier;
};

const createPaymentReference = (data, getCaseReference) => {
    const SERVICE_ID = config.payment.serviceId;
    const SITE_ID = config.payment.siteId;
    const ID_DELIMITER = '$$$';
    const FEE_DELIMITER = '$';
    const APPLICATION_FEE_CODE = config.payment.applicationFeeCode;
    const ADDITIONAL_COPY_FEE_CODE_UK = config.payment.copies.uk.code;
    const ADDITIONAL_COPY_FEE_CODE_OVERSEAS = config.payment.copies.overseas.code;
    const ADDITIONAL_COPY_FEE_DELIMITER = '/';
    let reference = SERVICE_ID + ID_DELIMITER + getCaseReference(data.deceasedLastName) + ID_DELIMITER + SITE_ID + ID_DELIMITER;
    const numberOfUkCopies = get(data, 'copies.uk.number', 0);
    const numberOfOverseasCopies = get(data, 'copies.overseas.number', 0);

    if (data.applicationFee === config.payment.applicationFee) {
        reference += APPLICATION_FEE_CODE;
        if (numberOfUkCopies > 0 || numberOfOverseasCopies > 0) {
           reference += FEE_DELIMITER;
        }
    }

    if (numberOfUkCopies > 0) {
        reference = reference + ADDITIONAL_COPY_FEE_CODE_UK + ADDITIONAL_COPY_FEE_DELIMITER + numberOfUkCopies;
        if (numberOfOverseasCopies > 0) {
            reference += FEE_DELIMITER;
        }
    }

    if (numberOfOverseasCopies > 0) {
        reference = reference + ADDITIONAL_COPY_FEE_CODE_OVERSEAS + ADDITIONAL_COPY_FEE_DELIMITER + numberOfOverseasCopies;
    }

    logger.info(`Payment reference: ${reference}`);
    return reference;
};

const createPaymentData = (data, getCaseReference = createCaseReference) => {
    const body = {};
    body.amount = data.amount * 100;
    body.reference = createPaymentReference(data, getCaseReference);
    body.description = `Probate Payment: ${data.amount}`;
    body.return_url = config.services.payment.returnUrl;
    return body;
};

module.exports = {
    createPaymentData: createPaymentData,
    createCaseReference: createCaseReference
};
