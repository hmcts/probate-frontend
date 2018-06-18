'use strict';

const utils = require('app/components/api-utils');
const config = require('app/config');
const submitData = require('app/components/submit-data');
const paymentData = require('app/components/payment-data');
const otp = require('otp');
const {URLSearchParams} = require('url');
const FormatUrl = require('app/utils/FormatUrl');
const IDAM_SERVICE_URL = config.services.idam.apiUrl;
const VALIDATION_SERVICE_URL = config.services.validation.url;
const SUBMIT_SERVICE_URL = config.services.submit.url;
const POSTCODE_SERVICE_URL = config.services.postcode.url;
const PERSISTENCE_SERVICE_URL = config.services.persistence.url;
const CREATE_PAYMENT_SERVICE_URL = config.services.payment.createPaymentUrl;
const TOKEN = config.services.postcode.token;
const PROXY = config.services.postcode.proxy;
const SERVICE_AUTHORISATION_URL = `${config.services.idam.s2s_url}/lease`;
const serviceName = config.services.idam.service_name;
const secret = config.services.idam.service_key;
const logger = require('app/components/logger')('Init');

const getUserDetails = (securityCookie) => {
    logger.info('getUserDetails');
    const url = `${IDAM_SERVICE_URL}/details`;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${securityCookie}`
    };
    const fetchOptions = utils.fetchOptions({}, 'GET', headers);
    return utils.fetchJson(url, fetchOptions);
};

const findAddress = (postcode) => {
    logger.info('findAddress');
    const url = `${POSTCODE_SERVICE_URL}?postcode=${encodeURIComponent(postcode)}`;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Token ${TOKEN}`
    };
    const fetchOptions = utils.fetchOptions({}, 'GET', headers, PROXY);
    return utils.fetchJson(url, fetchOptions);
};

const validateFormData = (data, sessionID) => {
    logger.info('validateFormData');
    const headers = {
        'Content-Type': 'application/json',
        'Session-Id': sessionID
    };
    const fetchOptions = utils.fetchOptions({formdata: data}, 'POST', headers);
    return utils.fetchJson(`${VALIDATION_SERVICE_URL}`, fetchOptions);
};

const submitApplication = (data, ctx, softStop) => {
    logger.info('submitApplication');
    const headers = {
        'Content-Type': 'application/json',
        'Session-Id': ctx.sessionID,
        'Authorization': ctx.authToken,
        'UserId': ctx.userId
    };
    const body = submitData(ctx, data);
    body.softStop = softStop;
    body.applicantEmail = data.applicantEmail;
    const fetchOptions = utils.fetchOptions({submitdata: body}, 'POST', headers);
    return utils.fetchJson(`${SUBMIT_SERVICE_URL}`, fetchOptions);
};

const loadFormData = (id, sessionID) => {
    logger.info('loadFormData');
    const headers = {
        'Content-Type': 'application/json',
        'Session-Id': sessionID
    };
    const fetchOptions = utils.fetchOptions({}, 'GET', headers);
    logger.info(`loadFormData url: ${PERSISTENCE_SERVICE_URL}/${id}`);
    return utils.fetchJson(`${PERSISTENCE_SERVICE_URL}/${id}`, fetchOptions);
};

const saveFormData = (id, data, sessionID) => {
    logger.info('saveFormData');
    const headers = {
        'Content-Type': 'application/json',
        'Session-Id': sessionID
    };
    const body = {
        id: id,
        formdata: data,
        submissionReference: data.submissionReference
    };
    const fetchOptions = utils.fetchOptions(body, 'POST', headers);
    return utils.fetchJson(`${PERSISTENCE_SERVICE_URL}`, fetchOptions);
};

const createPayment = (data) => {
    logger.info('createPayment');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': data.authToken,
        'ServiceAuthorization': data.serviceAuthToken
    };
    const body = paymentData.createPaymentData(data);
    const fetchOptions = utils.fetchOptions(body, 'POST', headers);
    const createPaymentUrl = CREATE_PAYMENT_SERVICE_URL.replace('userId', data.userId);
    logger.info('headers');
    logger.info(headers);
    logger.info('body');
    logger.info(body);
    logger.info('fetchOptions');
    logger.info(fetchOptions);
    logger.info('createPaymentUrl');
    logger.info(createPaymentUrl);
    return [utils.fetchJson(createPaymentUrl, fetchOptions), body.reference];
};

const findPayment = (data) => {
    logger.info('findPayment');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': data.authToken,
        'ServiceAuthorization': data.serviceAuthToken
    };

    const fetchOptions = utils.fetchOptions(data, 'GET', headers);
    const findPaymentUrl = `${CREATE_PAYMENT_SERVICE_URL.replace('userId', data.userId)}/${data.paymentId}`;
    logger.info('headers');
    logger.info(headers);
    logger.info('data');
    logger.info(data);
    logger.info('fetchOptions');
    logger.info(fetchOptions);
    logger.info('findPaymentUrl');
    logger.info(findPaymentUrl);
    return utils.fetchJson(findPaymentUrl, fetchOptions);
};

const findInviteLink = (inviteId) => {
    logger.info('find invite link');
    const findInviteLinkUrl = FormatUrl.format(PERSISTENCE_SERVICE_URL, `/invitedata/${inviteId}`);
    const fetchOptions = utils.fetchOptions({}, 'GET', {});
    return utils.fetchJson(findInviteLinkUrl, fetchOptions);
};

const updateInviteData = (inviteId, data) => {
    logger.info('update invite');
    const findInviteLinkUrl = FormatUrl.format(PERSISTENCE_SERVICE_URL, `/invitedata/${inviteId}`);
    const headers = {
        'Content-Type': 'application/json'
    };
    const fetchOptions = utils.fetchOptions(data, 'PATCH', headers);
    return utils.fetchJson(findInviteLinkUrl, fetchOptions);
};

const sendInvite = (data, sessionID) => {
    logger.info('send invite');
    const sendInviteUrl = FormatUrl.format(VALIDATION_SERVICE_URL, '/invite');
    const headers = {'Content-Type': 'application/json', 'Session-Id': sessionID};
    const fetchOptions = utils.fetchOptions(data, 'POST', headers);
    return utils.fetchText(sendInviteUrl, fetchOptions);
};

const checkAllAgreed = (formdataId) => {
    logger.info('check all agreed');
    const allAgreedUrl = FormatUrl.format(VALIDATION_SERVICE_URL, `/invites/allAgreed/${formdataId}`);
    const fetchOptions = utils.fetchOptions({}, 'GET', {});
    return utils.fetchText(allAgreedUrl, fetchOptions);
};

const sendPin = (phoneNumber, sessionID) => {
    logger.info('send pin');
    const pinServiceUrl = FormatUrl.format(VALIDATION_SERVICE_URL, `/pin/${phoneNumber}`);
    const fetchOptions = utils.fetchOptions({}, 'GET', {'Content-Type': 'application/json', 'Session-Id': sessionID});
    return utils.fetchJson(pinServiceUrl, fetchOptions);
};

const authorise = () => {
    logger.info('authorise');
    // const headers = {
    //     'Content-Type': 'application/x-www-form-urlencoded'
    // };
    const headers = {
        'Content-Type': 'application/json'
    };
    const oneTimePassword = otp ({secret: secret}).totp();
    // const params = new URLSearchParams();
    // params.append('microservice', serviceName);
    // params.append('oneTimePassword', oneTimePassword);
    const params = {
        microservice: serviceName,
        oneTimePassword: oneTimePassword
    };
    const fetchOptions = utils.fetchOptions(params, 'POST', headers);
    logger.info('headers');
    logger.info(headers);
    logger.info('params');
    logger.info(params);
    logger.info('fetchOptions');
    logger.info(fetchOptions);
    logger.info('SERVICE_AUTHORISATION_URL');
    logger.info(SERVICE_AUTHORISATION_URL);
    // return utils.fetchText(`${SERVICE_AUTHORISATION_URL}`, {method: 'POST', body: params, headers: fetchOptions.headers});
    const token = utils.fetchText(SERVICE_AUTHORISATION_URL, fetchOptions);
    logger.info(`s2s token: ${token}`);
    return token;
};

const getOauth2Token = (code, redirectUri) => {
    logger.info('calling oauth2 token');
    const clientName = config.services.idam.probate_oauth2_client;
    const secret = config.services.idam.probate_oauth2_secret;
    const idam_api_url = config.services.idam.apiUrl;

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${new Buffer(`${clientName}:${secret}`).toString('base64')}`
    };

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirectUri);

    return utils.fetchJson(`${idam_api_url}/oauth2/token`, {
        method: 'POST',
        timeout: 10000,
        body: params.toString(),
        headers: headers
    });
};

const updatePhoneNumber = (inviteId, data) => {
    logger.info('Update Phone Number');
    const findInviteUrl = FormatUrl.format(PERSISTENCE_SERVICE_URL, `/invitedata/${inviteId}`);
    const headers = {
        'Content-Type': 'application/json'
    };
    const fetchOptions = utils.fetchOptions(data, 'PATCH', headers);
    return utils.fetchJson(findInviteUrl, fetchOptions);
};

module.exports = {
    getUserDetails,
    findAddress,
    validateFormData,
    submitApplication,
    loadFormData,
    saveFormData,
    createPayment,
    findPayment,
    findInviteLink,
    updateInviteData,
    authorise,
    getOauth2Token,
    sendPin,
    sendInvite,
    updatePhoneNumber,
    checkAllAgreed
};
