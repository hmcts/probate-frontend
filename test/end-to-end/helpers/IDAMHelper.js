'use strict';

const Helper = codecept_helper;
const axios = require('axios');
const config = require('config');

class IDAMHelper extends Helper {
    async createAUser(options) {
        if (config.TestUseIdam === 'true') {
            console.log(`Creating user: ${options.getTestCitizenEmail()}`);
            const userDetails = options.getTestUserDetails();
            try {
                const axiosConfig = {
                    url: options.getTestAddUserURL(),
                    method: 'POST',
                    data: userDetails,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    validateStatus: () => true
                };

                if (options.getUseProxy() === 'true') {
                    axiosConfig.proxy = getAxiosProxyConfig(options.getProxy());
                }

                const response = await axios(axiosConfig);

                if (!response) {
                    throw new Error('TestConfigurator.getBefore: Using proxy - ERROR. No error raised, but no response obtained.');
                }

                if (response.status !== 201) {
                    throw new Error(
                        'TestConfigurator.getBefore: Using proxy - Unable to create user. Response from IDAM was: ' +
                        response.status
                    );
                }
                console.log('User created (via proxy)', userDetails);
            } catch (err) {
                throw new Error(
                    `TestConfigurator.getBefore: Using proxy - ERROR: ${err.message}\nError stack:\n${err.stack}`
                );
            }
        }
    }
}

function getAxiosProxyConfig(proxyUrl) {
    const parsedProxyUrl = new URL(proxyUrl);
    return {
        protocol: parsedProxyUrl.protocol.replace(':', ''),
        host: parsedProxyUrl.hostname,
        port: Number(parsedProxyUrl.port)
    };
}

module.exports = IDAMHelper;
