'use strict';

const Helper = codecept_helper;
const request = require('request');
const util = require('util');
const config = require('config');

class IDAMHelper extends Helper {
    // Creating a test user via a custom Helper means that CodeceptJS's .retry()
    // can be used to retry the step if it fails.
    async createAUser(options) {
        if (config.TestUseIdam === 'true') {
            console.log(`Creating user: ${options.getTestCitizenEmail()}`);
            const httpReq = util.promisify(request);
            const userDetails = options.getTestUserDetails();

            try {
                const response = await httpReq({
                    url: options.getTestAddUserURL(),
                    proxy: options.getUseProxy() === 'true' ? options.getProxy() : null,
                    method: 'POST',
                    json: true, // <--Very important!!!
                    body: userDetails
                });
                if (!response) {
                    throw new Error('TestConfigurator.getBefore: Using proxy - ERROR. No error raised, but no response obtained.');
                } else if (response.statusCode !== 201) {
                    throw new Error('TestConfigurator.getBefore: Using proxy - Unable to create user.  Response from IDAM was: ' + response.statusCode);
                } else {
                    console.log('User created (via proxy)', options.userDetails);
                }
            } catch (err) {
                throw new Error(`TestConfigurator.getBefore: Using proxy - ERROR: ${err.message}\nError stack:\n${err.stack}`);
            }
        }
    }
}

module.exports = IDAMHelper;
