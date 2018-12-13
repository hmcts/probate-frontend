'use strict';

const Service = require('./Service');

class InviteData extends Service {
    patch(inviteId, data) {
        this.log('Patch invite data');
        const url = this.formatUrl.format(this.endpoint, `/invitedata/${inviteId}`);
        const headers = {
            'Content-Type': 'application/json'
        };
        const fetchOptions = this.fetchOptions(data, 'PATCH', headers);
        return this.fetchJson(url, fetchOptions);
    }

    delete(inviteId) {
        this.log('delete invite data');
        const url = this.formatUrl.format(this.endpoint, `/invitedata/${inviteId}`);
        const fetchOptions = this.fetchOptions({}, 'DELETE', {});
        return this.fetchText(url, fetchOptions);
    }
}

module.exports = InviteData;
