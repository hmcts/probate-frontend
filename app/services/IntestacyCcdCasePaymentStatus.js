'use strict';

const CcdCasePaymentStatus = require('./CcdCasePaymentStatus');
const submitData = require('app/components/submit-data');

class IntestacyCcdCasePaymentStatus extends CcdCasePaymentStatus {
    post(data, ctx) {
        const logMessage = 'Post intestacy ccd case payment status';
        const url = this.endpoint + this.config.services.orchestrator.paths.payments;
        const bodyData = submitData(ctx, data);
        return super.post(ctx, logMessage, url, bodyData);
    }
}

module.exports = IntestacyCcdCasePaymentStatus;
