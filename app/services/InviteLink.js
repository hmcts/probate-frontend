'use strict';

const Service = require('./Service');
const AsyncFetch = require('app/utils/AsyncFetch');

class InviteLink extends Service {
    get(inviteId, authToken, serviceAuthorisation) {
        this.log('Get invite link');
        const url = this.formatUrl.format(this.endpoint, `/invite/data/${inviteId}`);
        const headers = {
            'Authorization': authToken,
            'ServiceAuthorization': serviceAuthorisation
        };
        const fetchOptions = AsyncFetch.fetchOptions({}, 'GET', headers);
        return AsyncFetch.fetchJson(url, fetchOptions);
    }

    post(data, authToken, serviceAuthorisation, bilingual = false) {
        this.log('Post invite link');
        const url = this.formatUrl.format(this.endpoint, '/invite' + (bilingual ? '/bilingual' : ''));
        const headers = {
            'Content-Type': 'application/json',
            'Session-Id': this.sessionId,
            'Authorization': authToken,
            'ServiceAuthorization': serviceAuthorisation
        };
        const fetchOptions = AsyncFetch.fetchOptions(data, 'POST', headers);
        return AsyncFetch.fetchJson(url, fetchOptions);
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
