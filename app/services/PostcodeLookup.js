'use strict';

const axios = require('axios');
const config = require('config');
const logger = require('app/components/logger');

const logError = (message, applicationId = 'Init') => logger(applicationId).error(message);
const logInfo = (message, applicationId = 'Init') => logger(applicationId).info(message);

class PostcodeLookup {

    get(postcode) {
        logInfo(`Get postcode address: ${postcode}`);
        return axios.get('postcode', {
            baseURL: config.services.postcode.url,
            headers: {
                accept: 'application/json',
            },
            params: {
                key: config.services.postcode.token,
                lr: 'EN',
                postcode,
            },
        })
            .then(response => {
                if (!response.data?.results) {
                    logInfo('No results found for postcode, returning empty list');
                    return [];
                }

                return response.data.results.map(({DPA}) => {
                    const {
                        ADDRESS,
                        POSTCODE,
                    } = DPA;

                    return {
                        formattedAddress: ADDRESS,
                        postcode: POSTCODE,
                    };
                });
            })
            .catch(err => {
                logError(`Postcode lookup failed to run: ${err}`);
                // Returning empty list on error to match your logic
                return [];
            });
    }
}

module.exports = PostcodeLookup;
