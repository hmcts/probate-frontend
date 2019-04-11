'use strict';

const {get} = require('lodash');
const FeesLookup = require('app/services/FeesLookup');
const config = require('app/config');
let feesLookup;
const issuesData = {
    amount_or_volume: 0,
    applicant_type: 'all',
    channel: 'default',
    event: 'issue',
    jurisdiction1: 'family',
    jurisdiction2: 'probate registry',
    service: 'probate'
};

const copiesData = {
    amount_or_volume: 0,
    applicant_type: 'all',
    channel: 'default',
    event: 'copies',
    jurisdiction1: 'family',
    jurisdiction2: 'probate registry',
    service: 'probate'
};

class FeesCalculator {
    constructor(endpoint, sessionId) {
        feesLookup = new FeesLookup(endpoint, sessionId);
    }

    calc(formdata, authToken, newFeesToggle) {
        const headers = {
            authToken: authToken
        };
        return createCallsRequired(formdata, headers, newFeesToggle);
    }
}

async function createCallsRequired(formdata, headers, newFeesToggle) {
    const returnResult = {
        status: 'success',
        applicationfee: 0,
        applicationvalue: 0,
        ukcopies: 0,
        ukcopiesfee: 0,
        overseascopies: 0,
        overseascopiesfee: 0,
        total: 0
    };

    issuesData.amount_or_volume = get(formdata, 'iht.netValue', 0);
    returnResult.applicationvalue = issuesData.amount_or_volume;
    if (newFeesToggle || issuesData.amount_or_volume > config.services.feesRegister.ihtMinAmt) {
        if (newFeesToggle) {
            issuesData.keyword = 'pro1';
        }
        await feesLookup.get(issuesData, headers)
            .then((res) => {
                if (identifyAnyErrors(res)) {
                    returnResult.status = 'failed';
                } else {
                    returnResult.applicationfee += res.fee_amount;
                    returnResult.total += res.fee_amount;
                }
            });
    }

    returnResult.ukcopies = get(formdata, 'copies.uk', 0);
    if (returnResult.ukcopies > 0) {
        if (newFeesToggle) {
            copiesData.amount_or_volume = 1;
            copiesData.keyword = 'DEF';
        }
        await feesLookup.get(copiesData, headers)
            .then((res) => {
                if (identifyAnyErrors(res)) {
                    returnResult.status = 'failed';
                } else {
                    returnResult.ukcopiesfee += res.fee_amount;
                    returnResult.total += res.fee_amount;
                }
            });

        if (newFeesToggle && returnResult.ukcopies > 1) {
            copiesData.amount_or_volume = returnResult.ukcopies - 1;
            delete copiesData.keyword;
            await feesLookup.get(copiesData, headers)
                .then((res) => {
                    if (identifyAnyErrors(res)) {
                        returnResult.status = 'failed';
                    } else {
                        returnResult.ukcopiesfee += res.fee_amount;
                        returnResult.total += res.fee_amount;
                    }
                });
        }
    }

    returnResult.overseascopies = get(formdata, 'copies.overseas', 0);
    if (returnResult.overseascopies > 0) {
        if (newFeesToggle) {
            copiesData.amount_or_volume = 1;
            copiesData.keyword = 'DEF';
        }
        await feesLookup.get(copiesData, headers)
            .then((res) => {
                if (identifyAnyErrors(res)) {
                    returnResult.status = 'failed';
                } else {
                    returnResult.overseascopiesfee += res.fee_amount;
                    returnResult.total += res.fee_amount;
                }
            });

        if (newFeesToggle && returnResult.overseascopies > 1) {
            copiesData.amount_or_volume = returnResult.overseascopies - 1;
            delete copiesData.keyword;
            await feesLookup.get(copiesData, headers)
                .then((res) => {
                    if (identifyAnyErrors(res)) {
                        returnResult.status = 'failed';
                    } else {
                        returnResult.overseascopiesfee += res.fee_amount;
                        returnResult.total += res.fee_amount;
                    }
                });
        }
    }

    return returnResult;
}

/*
 * if no fee_amount is returned, we assume an error has occured
 * this caters for 404 type messages etc.
 */
function identifyAnyErrors(res) {
    if (res.fee_amount >= 0) {
        return false;
    }
    return true;
}

module.exports = FeesCalculator;
