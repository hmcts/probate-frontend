'use strict';

const Service = require('./Service');

class InviteLink extends Service {
    get(inviteId, authToken, serviceAuthorisation) {
        this.log('Get invite link');
        const url = this.formatUrl.format(this.endpoint, `/invite/data/${inviteId}`);
        const headers = {
            'Authorization': authToken,
            'ServiceAuthorization': serviceAuthorisation
        };
        const fetchOptions = this.fetchOptions({}, 'GET', headers);
        return this.fetchJson(url, fetchOptions);
    }

    post(data, authToken, serviceAuthorisation) {
        this.log('Post invite link');
        const url = this.formatUrl.format(this.endpoint, '/invite');
        const headers = {
            'Content-Type': 'application/json',
            'Session-Id': this.sessionId,
            'Authorization': authToken,
            'ServiceAuthorization': serviceAuthorisation
        };
        const fetchOptions = this.fetchOptions(data, 'POST', headers);
        return this.fetchJson(url, fetchOptions);
    }

    encodeURLNameParams(invitation) {
        for (const key in invitation) {
            if (key.includes('Name')) {
                invitation[key] = encodeURIComponent(invitation[key]);
            }
        }
        return invitation;
    }
}

module.exports = InviteLink;
