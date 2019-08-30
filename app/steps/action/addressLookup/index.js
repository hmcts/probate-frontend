'use strict';

const {isEmpty} = require('lodash');
const ValidationStep = require('app/core/steps/ValidationStep');
const ActionStepRunner = require('app/core/runners/ActionStepRunner');
const FieldError = require('app/components/error');
const PostcodeAddress = require('app/services/PostcodeAddress');
const stringUtils = require('app/components/string-utils');
const logger = require('app/components/logger')('Init');

class AddressLookup extends ValidationStep {
    static getUrl() {
        return '/find-address';
    }

    runner() {
        return new ActionStepRunner();
    }

    next() {
        return this.steps[this.referrer];
    }

    * handlePost(ctx, errors, formdata) {
        this.referrer = ctx.referrer;
        let referrerData = this.getReferrerData(ctx, formdata);
        referrerData = this.pruneReferrerData(referrerData);
        referrerData.postcode = ctx.postcode;

        if (isEmpty(errors)) {
            try {
                const postcodeAddress = new PostcodeAddress();
                const addresses = yield postcodeAddress.get(ctx.postcode);
                if (!isEmpty(addresses)) {
                    logger.error(`Addresses found for postcode: ${ctx.postcode}`);
                    referrerData.addresses = addresses;
                    referrerData.addressFound = 'true';
                    for (const key in referrerData.addresses) {
                        referrerData.addresses[key].formattedAddress = stringUtils
                            .updateLookupFormattedAddress(
                                referrerData.addresses[key].formattedAddress,
                                referrerData.addresses[key].postcode
                            );
                    }
                } else {
                    logger.error(`No addresses found for postcode: ${ctx.postcode}`);
                    referrerData.addressFound = 'false';
                    referrerData.errors = [FieldError('postcode', 'noAddresses', this.resourcePath, ctx)];
                }
            } catch (e) {
                logger.error(`An error occurred likely to be an invalid postcode for : ${ctx.postcode}`);
                referrerData.addressFound = 'false';
                referrerData.errors = [FieldError('postcode', 'invalid', this.resourcePath, ctx)];
            }
        } else {
            referrerData.errors = errors;
        }

        return [ctx];
    }

    getReferrerData(ctx, formdata) {
        const refSection = this.steps[ctx.referrer].section;
        if (!formdata[refSection]) {
            formdata[refSection] = {};
        }
        return formdata[refSection];
    }

    pruneReferrerData(referrerData) {
        delete referrerData.addresses;
        delete referrerData.addressFound;
        delete referrerData.errors;
        return referrerData;
    }
}

module.exports = AddressLookup;
