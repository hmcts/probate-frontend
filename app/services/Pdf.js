'use strict';

const Service = require('./Service');
const Authorise = require('./Authorise');
const config = require('config');
const AsyncFetch = require('app/utils/AsyncFetch');

class Pdf extends Service {

    post(pdfTemplate, body, logMessage, req) {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': req.authToken,
            'ServiceAuthorization': req.session.serviceAuthorization
        };
        const businessDocumentUrl = this.formatUrl.format(this.endpoint, this.config.pdf.path);
        const url = `${businessDocumentUrl}/${pdfTemplate}`;
        this.log(logMessage);
        const authorise = new Authorise(this.config.services.idam.s2s_url, this.sessionId);
        return authorise
            .post()
            .then(serviceToken => {
                headers.ServiceAuthorization = serviceToken;
                const fetchOptions = AsyncFetch.fetchOptions(body, 'POST', headers);
                fetchOptions.timeout = config.pdf.timeoutMs;
                return this.fetchBuffer(url, fetchOptions);
            })
            .catch(err => {
                this.log(`Pdf error: ${this.formatErrorMessage(err)}`, 'error');
                throw new Error(err);
            });
    }
}

module.exports = Pdf;
