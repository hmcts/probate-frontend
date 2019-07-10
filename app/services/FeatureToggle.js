'use strict';

const Service = require('./Service');

class FeatureToggle extends Service {
    async get(featureToggleKey) {
        this.log('Get feature toggle');
        const url = `${this.endpoint}${this.config.featureToggles.path}/${featureToggleKey}`;
        const headers = {
            'Content-Type': 'application/json'
        };
        const fetchOptions = this.fetchOptions({}, 'GET', headers);
        const result = await this.fetchText(url, fetchOptions);
        if (result.name === 'Error') {
            return false;
        }
        return result;
    }
}

module.exports = FeatureToggle;
