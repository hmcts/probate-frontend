'use strict';

const Service = require('./Service');

class InviteData extends Service {

    setAgreedFlag(authToken, serviceAuthorisation, ccdCaseId, data) {
        this.log('Set agreed flag invite data');
        const url = this.formatUrl.format(this.endpoint, `/invite/agreed/${ccdCaseId}`);
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': authToken,
            'ServiceAuthorization': serviceAuthorisation
        };
        const fetchOptions = this.fetchOptions(data, 'POST', headers);
        return this.fetchText(url, fetchOptions);
    }

    resetAgreedFlag(ccdCaseId, ctx) {
        this.log('Reset agreed flag invite data');
        const url = this.formatUrl.format(this.endpoint, `/invite/resetAgreed/${ccdCaseId}`);
        const headers = this.constructHeaders(ctx);
        const fetchOptions = this.fetchOptions({}, 'POST', headers);
        return this.fetchJson(url, fetchOptions);
    }

    updateContactDetails(ccdCaseId, data, ctx) {
        this.log('Update contact details invite data');
        const url = this.formatUrl.format(this.endpoint, `/invite/contactdetails/${ccdCaseId}`);
        const headers = this.constructHeaders(ctx);
        const fetchOptions = this.fetchOptions(data, 'POST', headers);
        return this.fetchText(url, fetchOptions);
    }

    delete(ccdCaseId, data, req) {
        this.log('delete invite data');
        const url = this.formatUrl.format(this.endpoint, `/invite/delete/${ccdCaseId}`);
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': req.authToken,
            'ServiceAuthorization': req.session.serviceAuthorization
        };
        const fetchOptions = this.fetchOptions(data, 'POST', headers);
        return this.fetchJson(url, fetchOptions);
    }

    constructHeaders(ctx) {
        return {
            'Content-Type': 'application/json',
            'Authorization': ctx.authToken,
            'ServiceAuthorization': ctx.serviceAuthorization
        };
    }
}

module.exports = InviteData;
