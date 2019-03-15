'use strict';

const {get} = require('lodash');
const FeesLookup = require('app/services/FeesLookup');
let feesLookup;
const issuesData = {
    amount_or_volume: 0,
    applicant_type: 'all',
    channel: 'default',
    event: 'issue',
    jurisdiction1: 'family',
    jurisdiction2: 'probate registry',
    service: 'probate',
    keyword: 'pro1'
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
        this.endpoint = endpoint;
        this.sessionId = sessionId;
        feesLookup = new FeesLookup(this.endpoint, sessionId);
    }

    calc(formdata, authToken) {
        const headers = {
            authToken: authToken
        };
        return createCallsRequired(formdata, headers);
    }
}

async function createCallsRequired(formdata, headers) {
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

    await feesLookup.get(issuesData, headers)
        .then((res) => {
            if (identifyAnyErrors(res)) {
                returnResult.status = 'failed';
            } else {
                returnResult.applicationfee += res.fee_amount;
                returnResult.total += res.fee_amount;
            }
        });

    returnResult.ukcopies = get(formdata, 'copies.uk', 0);
    if (returnResult.ukcopies > 0) {
        copiesData.amount_or_volume = 1;
        copiesData.keyword = 'DEF';
        await feesLookup.get(copiesData, headers)
            .then((res) => {
                if (identifyAnyErrors(res)) {
                    returnResult.status = 'failed';
                } else {
                    returnResult.ukcopiesfee += res.fee_amount;
                    returnResult.total += res.fee_amount;
                }
            });

        if (returnResult.ukcopies > 1) {
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
        copiesData.amount_or_volume = 1;
        copiesData.keyword = 'DEF';
        await feesLookup.get(copiesData, headers)
            .then((res) => {
                if (identifyAnyErrors(res)) {
                    returnResult.status = 'failed';
                } else {
                    returnResult.overseascopiesfee += res.fee_amount;
                    returnResult.total += res.fee_amount;
                }
            });

        if (returnResult.overseascopies > 1) {
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
