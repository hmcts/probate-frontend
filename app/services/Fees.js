'use strict';
const config = require('app/config');
const FeesRegister = require('app/services/FeesRegister');
const {URLSearchParams} = require('url');

class Fees extends FeesRegister {
    get(data, headers) {
        this.log('Get payment fees');
        const params = new URLSearchParams(data);
        const url = `${this.endpoint}${config.services.feesRegister.paths.fees}?${params.toString()}`;
        return super.get(url, headers);
    }

}

module.exports = Fees;
