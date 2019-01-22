'use strict';

const Service = require('./Service');
const Authorise = require('./Authorise');

class Pdf extends Service {
    post(body, logMessage, headers, url) {
        this.log(logMessage);
        const authorise = new Authorise(this.config.services.idam.s2s_url, this.sessionId);
        return authorise
            .post()
            .then(serviceToken => {
                headers.ServiceAuthorization = serviceToken;
                const fetchOptions = this.fetchOptions(body, 'POST', headers);
                return this.fetchBuffer(url, fetchOptions);
            })
            .catch(err => {
                this.log(err, 'error');
            });
    }
}

module.exports = Pdf;
