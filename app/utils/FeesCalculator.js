'use strict';

const {get} = require('lodash');
const FeesLookup = require('app/services/FeesLookup');
const config = require('config');
const logger = require('app/components/logger')('Init');
const featureToggle = require('app/utils/FeatureToggle');

class FeesCalculator {

    constructor(endpoint, sessionId) {
        this.endpoint = endpoint;
        this.sessionId = sessionId;
        this.issuesData = config.services.feesRegister.issuesData;
        this.copiesData = config.services.feesRegister.copiesData;
        this.issuesDataIhtMinAmount = config.services.feesRegister.issuesData;
        this.feesLookup = new FeesLookup(this.endpoint, sessionId);
    }

    calc(formdata, authToken, featureToggles) {
        const headers = {
            authToken: authToken
        };

        if (featureToggle.isEnabled(featureToggles, 'ft_newfee_register_code')) {
            this.issuesData = config.services.feesRegister.newfee_issuesData;
            this.copiesData = config.services.feesRegister.newfee_copiesData;
            this.issuesDataIhtMinAmount = config.services.feesRegister.newfee_issuesDataIhtMinAmount;
        }

        return createCallsRequired(formdata, headers, featureToggles, this.feesLookup, this.issuesData, this.copiesData, this.issuesDataIhtMinAmount);
    }
}

async function createCallsRequired(formdata, headers, featureToggles, feesLookup, issuesData, copiesData, issuesDataIhtMinAmount) {
    const returnResult = {
        status: 'success',
        applicationfee: 0,
        applicationvalue: 0,
        applicationversion: 0,
        applicationcode: '',
        ukcopies: 0,
        ukcopiesfee: 0,
        ukcopiesversion: 0,
        ukcopiescode: '',
        overseascopies: 0,
        overseascopiesfee: 0,
        overseascopiesversion: 0,
        overseascopiescode: '',
        total: 0,
    };

    const amount = get(formdata, 'iht.netValue', 0);
    console.log('form data => ', formdata);
    console.log('iht.netValue fee calculation amount => ', amount);
    const updatedIssuesData = amount > config.services.feesRegister.ihtMinAmt? issuesData: issuesDataIhtMinAmount;
    returnResult.applicationvalue = amount;

    if (updatedIssuesData) {
        updatedIssuesData.amount_or_volume = amount;
        logger.info('Sending APPLICATION FEE request to API with the following payload:');
        logger.info(JSON.stringify(updatedIssuesData));

        await feesLookup.get(updatedIssuesData, headers)
            .then((res) => {
                if (identifyAnyErrors(res)) {
                    returnResult.status = 'failed';
                } else {
                    returnResult.applicationfee = res.fee_amount;
                    returnResult.total += res.fee_amount;
                    returnResult.applicationcode = res.code;
                    returnResult.applicationversion = res.version;
                }
            });
    }

    copiesData.amount_or_volume = get(formdata, 'copies.uk', 0);
    returnResult.ukcopies = copiesData.amount_or_volume;
    if (copiesData.amount_or_volume > 0) {
        logger.info('Sending COPIES FEE request to API with the following payload:');
        logger.info(JSON.stringify(copiesData));

        await feesLookup.get(copiesData, headers)
            .then((res) => {
                if (identifyAnyErrors(res)) {
                    returnResult.status = 'failed';
                } else {
                    returnResult.ukcopiesfee = res.fee_amount;
                    returnResult.total += res.fee_amount;
                    returnResult.ukcopiescode = res.code;
                    returnResult.ukcopiesversion = res.version;
                }
            });
    }

    copiesData.amount_or_volume = get(formdata, 'copies.overseas', 0);
    returnResult.overseascopies = copiesData.amount_or_volume;
    if (copiesData.amount_or_volume > 0) {
        await feesLookup.get(copiesData, headers)
            .then((res) => {
                if (identifyAnyErrors(res)) {
                    returnResult.status = 'failed';
                } else {
                    returnResult.overseascopiesfee = res.fee_amount;
                    returnResult.total += res.fee_amount;
                    returnResult.overseascopiescode = res.code;
                    returnResult.overseascopiesversion = res.version;
                }
            });
    }

    return returnResult;
}

/*
 * if no fee_amount is returned, we assume an error has occurred
 * this caters for 404 type messages etc.
 */
const identifyAnyErrors = (res) => {
    if (res.fee_amount) {
        return false;
    }
    return true;
};

module.exports = FeesCalculator;
