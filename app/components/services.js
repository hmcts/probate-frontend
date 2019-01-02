'use strict';

const utils = require('app/components/api-utils');
const config = require('app/config');
const {URLSearchParams} = require('url');
const FormatUrl = require('app/utils/FormatUrl');
const logger = require('app/components/logger');
const superagent = require('superagent');
const IDAM_SERVICE_URL = config.services.idam.apiUrl;
const VALIDATION_SERVICE_URL = config.services.validation.url;
const PERSISTENCE_SERVICE_URL = config.services.persistence.url;
const secret = config.services.idam.service_key;
const logInfo = (message, sessionId = 'Init') => logger(sessionId).info(message);

const getOauth2Token = (code, redirectUri) => {
    logInfo('calling oauth2 token');
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

const removeExecutor = (inviteId) => {
    logInfo('Removing executor from invitedata table');
    const removeExecutorUrl = FormatUrl.format(PERSISTENCE_SERVICE_URL, `/invitedata/${inviteId}`);
    const fetchOptions = utils.fetchOptions({}, 'DELETE', {});
    return utils.fetchText(removeExecutorUrl, fetchOptions);
};

const updateContactDetails = (inviteId, data) => {
    logInfo('Update Contact Details');
    const findInviteUrl = FormatUrl.format(PERSISTENCE_SERVICE_URL, `/invitedata/${inviteId}`);
    const headers = {
        'Content-Type': 'application/json'
    };
    const fetchOptions = utils.fetchOptions(data, 'PATCH', headers);
    return utils.fetchJson(findInviteUrl, fetchOptions);
};

const signOut = (access_token) => {
    logInfo('signing out of IDAM');
    const clientName = config.services.idam.probate_oauth2_client;
    const headers = {
        'Authorization': `Basic ${new Buffer(`${clientName}:${secret}`).toString('base64')}`
    };
    const fetchOptions = utils.fetchOptions({}, 'DELETE', headers);
    return utils.fetchJson(`${IDAM_SERVICE_URL}/session/${access_token}`, fetchOptions);
};

const uploadDocument = (sessionId, userId, uploadedDocument) => {
    logInfo('Uploading document', sessionId);
    const uploadDocumentUrl = FormatUrl.format(VALIDATION_SERVICE_URL, config.documentUpload.paths.upload);
    const clientName = config.services.idam.probate_oauth2_client;
    return superagent
        .post(uploadDocumentUrl)
        .set('Authorization', `Basic ${new Buffer(`${clientName}:${secret}`).toString('base64')}`)
        .set('enctype', 'multipart/form-data')
        .set('user-id', userId)
        .attach('file', uploadedDocument.buffer, uploadedDocument.originalname);
};

const removeDocument = (documentId, userId) => {
    logInfo('Removing document');
    const removeDocumentUrl = FormatUrl.format(VALIDATION_SERVICE_URL, `${config.documentUpload.paths.remove}/${documentId}`);
    const headers = {
        'user-id': userId
    };
    const fetchOptions = utils.fetchOptions({}, 'DELETE', headers);
    return utils.fetchText(removeDocumentUrl, fetchOptions);
};

module.exports = {
    getOauth2Token,
    updateContactDetails,
    removeExecutor,
    signOut,
    uploadDocument,
    removeDocument
};
