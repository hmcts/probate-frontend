'use strict';

const config = require('config');
const POSTCODE_SERVICE_TOKEN = config.services.postcode.token;
const OSPlacesClient = require('@hmcts/os-places-client').OSPlacesClient;
const osPlacesClient = new OSPlacesClient(POSTCODE_SERVICE_TOKEN);
const logger = require('app/components/logger');
const logError = (message, applicationId = 'Init') => logger(applicationId).error(message);
const logInfo = (message, applicationId = 'Init') => logger(applicationId).info(message);

class PostcodeAddress {

    get(postcode) {
        logInfo(`Get postcode address: ${postcode}`);
        return new Promise((resolve, reject) => {
            osPlacesClient.lookupByPostcode(postcode)
                .then(res => {
                    if (res.valid) {
                        resolve(res.addresses);
                    } else {
                        logError('Postcode invalid returning empty list');
                        resolve({});
                    }
                })
                .catch(err => {
                    logError(`Postcode lookup failed to run: ${err}`);
                    reject(new Error('Failed to retrieve address list'));
                });
        });
    }
}

module.exports = PostcodeAddress;
