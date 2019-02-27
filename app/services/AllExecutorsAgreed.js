'use strict';

const Service = require('./Service');

class AllExecutorsAgreed extends Service {
    get(formdataId) {
        this.log('Get all executors agreed');
        const url = this.formatUrl.format(this.endpoint, `/invites/allAgreed/${formdataId}`);
        const fetchOptions = this.fetchOptions({}, 'GET', {});
        return this.fetchText(url, fetchOptions);
    }
}

module.exports = AllExecutorsAgreed;
