'use strict';

const Service = require('./Service');

class InviteLink extends Service {
    get(inviteId) {
        this.log('Get invite link');
        const url = this.formatUrl.format(this.endpoint, `/invitedata/${inviteId}`);
        const fetchOptions = this.fetchOptions({}, 'GET', {});
        return this.fetchJson(url, fetchOptions);
    }

    post(data, sessionID, exec) {
        this.log('Post invite link');
        const urlParam = exec.inviteId ? `/${exec.inviteId}` : '';
        const url = this.formatUrl.format(this.endpoint, `/invite${urlParam}`);
        const headers = {'Content-Type': 'application/json', 'Session-Id': sessionID};
        const fetchOptions = this.fetchOptions(data, 'POST', headers);
        return this.fetchText(url, fetchOptions);
    }
}

module.exports = InviteLink;
