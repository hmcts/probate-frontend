'use strict';

const CcdCasePaymentStatus = require('./CcdCasePaymentStatus');
const submitData = require('app/components/submit-data');

class ProbateCcdCasePaymentStatus extends CcdCasePaymentStatus {
    post(data, ctx) {
        const logMessage = 'Post probate ccd case payment status';
        const url = `${this.endpoint}/updatePaymentStatus`;
        const bodyData = {submitdata: submitData(ctx, data)};
        return super.post(ctx, logMessage, url, bodyData);
    }
}

module.exports = ProbateCcdCasePaymentStatus;
