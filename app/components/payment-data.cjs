'use strict';

const config = require('config');
const SERVICE_ID = config.payment.serviceId;
const SITE_ID = config.payment.siteId;

const createPaymentData = (data, language) => {
    const commonContent = require(`app/resources/${language}/translation/common`);
    const currency = config.payment.currency;
    const paymentData = {
        amount: data.amount,
        description: commonContent.paymentProbateFees,
        ccd_case_number: data.ccdCaseId,
        service: SERVICE_ID,
        currency: currency,
        site_id: SITE_ID,
        fees: [],
        language: (language === 'en' ? '' : language.toUpperCase())
    };

    if (data.applicationFee > 0) {
        paymentData.fees.push(createPaymentFees({
            amount: data.applicationFee,
            ccdCaseId: data.ccdCaseId,
            code: data.applicationcode,
            memoLine: 'Probate Fees',
            reference: data.userId,
            version: data.applicationversion,
            volume: 1
        }));
    }

    if (data.copies.uk.number > 0) {
        paymentData.fees.push(createPaymentFees({
            amount: data.copies.uk.cost,
            ccdCaseId: data.ccdCaseId,
            code: data.ukcopiescode,
            memoLine: 'Additional UK copies',
            reference: data.userId,
            version: data.ukcopiesversion,
            volume: data.copies.uk.number
        }));
    }

    if (data.copies.overseas.number > 0) {
        paymentData.fees.push(createPaymentFees({
            amount: data.copies.overseas.cost,
            ccdCaseId: data.ccdCaseId,
            code: data.overseascopiescode,
            memoLine: 'Additional overseas copies',
            reference: data.userId,
            version: data.overseascopiesversion,
            volume: data.copies.overseas.number
        }));
    }

    return paymentData;
};

const createPaymentFees = (params) => {
    return {
        calculated_amount: params.amount,
        ccd_case_number: params.ccdCaseId,
        code: params.code,
        memo_line: params.memoLine,
        reference: params.reference,
        version: params.version,
        volume: params.volume
    };
};

module.exports = {
    createPaymentData: createPaymentData,
    createPaymentFees: createPaymentFees
};
