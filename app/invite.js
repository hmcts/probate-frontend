'use strict';

const logger = require('app/components/logger')('Init');
const {isEmpty} = require('lodash');
const InviteLinkService = require('app/services/InviteLink');
const AllExecutorsAgreed = require('app/services/AllExecutorsAgreed');
const config = require('config');
const PinNumber = require('app/services/PinNumber');
const Security = require('app/services/Security');
const Authorise = require('app/services/Authorise');
const FormatUrl = require('app/utils/FormatUrl');

class InviteLink {

    constructor(redisClient, pinTimeout) {
        this.redisClient = redisClient;
        this.pinTimeout = pinTimeout;
    }

    verify() {
        const self = this;

        return (req, res) => {
            self.checkLinkIsValid(req, res,
                (res) => res.redirect('/sign-in'),
                (res) => res.redirect('/errors/404'));
        };
    }

    sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    checkLinkIsValid(req, res, success, failure) {
        this.getAuth(req)
            .then(([authToken, serviceAuthorisation]) => {
                if (authToken === null || serviceAuthorisation === null) {
                    logger.error('Error while getting the authToken and serviceAuthorisation');
                    return Promise.reject(new Error('Error getting authToken and serviceAuthorisation'));
                }
                const inviteId = req.params.inviteId;
                const inviteLink = new InviteLinkService(config.services.orchestrator.url, req.sessionID);

                const sessionId = req.sessionID;
                return inviteLink.get(inviteId, authToken, serviceAuthorisation)
                    .then(result => {
                        return {authToken, serviceAuthorisation, inviteId, result, sessionId};
                    });
            })
            .then(resultObj => {
                const result = resultObj.result;
                const serviceAuthorisation = resultObj.serviceAuthorisation;
                const authToken = resultObj.authToken;
                const inviteId = resultObj.inviteId;
                const sessionId = resultObj.sessionId;

                if (result.name === 'Error') {
                    logger.error(`Error while verifying the token: ${result.message}`);
                    return Promise.reject(new Error(`Error while verifying the token: ${result.message}`));
                }
                logger.info('Link is valid');

                req.session.phoneNumber = result.phoneNumber;
                req.session.leadExecutorName = result.mainExecutorName;
                req.session.formdataId = result.formdataId;
                req.session.inviteId = inviteId;
                req.session.validLink = true;

                // check whether we have recently sent a PIN
                return this.redisClient.get(inviteId)
                    .then(pinValue => {
                        if (pinValue) {
                            return this.redisClient.ttl(inviteId)
                                .then(ttl => {
                                    logger.info(`Recently seen invite: ${inviteId} (ttl: ${ttl}), not resending`);
                                    return pinValue;
                                });
                        }
                        logger.info(`Not seen invite: ${inviteId}, send pin and setting timeout to ${this.pinTimeout}`);
                        const pinNumber = new PinNumber(config.services.orchestrator.url, sessionId);
                        const bilingual = result.bilingual === 'optionYes';

                        return pinNumber.get(result.phoneNumber, bilingual, authToken, serviceAuthorisation)
                            .then(generatedPin => {
                                this.redisClient.set(inviteId, generatedPin);
                                this.redisClient.expire(inviteId, this.pinTimeout);

                                return generatedPin;
                            });
                    });
            })
            .then(pin => {
                req.session.pin = pin;
                success(res);
            })
            .catch(err => {
                logger.error(`Error while getting the authToken and serviceAuthorisation: ${err}`);
                failure(res);
            });
    }

    checkCoApplicant(useIDAM) {
        return (req, res, next) => {
            if (useIDAM === 'true' && isEmpty(req.session.inviteId)) {
                const commonContent = require(`app/resources/${req.session.language}/translation/common`);

                res.status(404);
                return res.render('errors/error', {common: commonContent, error: '404', userLoggedIn: req.userLoggedIn});
            }

            this.getAuth(req, res)
                .then(([authToken, serviceAuthorisation]) => {
                    const ccdCaseId = req.session.form && req.session.form.ccdCase ? req.session.form.ccdCase.id : 'undefined';

                    if (req.originalUrl === '/co-applicant-agree-page') {
                        const allExecutorsAgreed = new AllExecutorsAgreed(config.services.orchestrator.url, req.sessionID);

                        allExecutorsAgreed.get(authToken, serviceAuthorisation, ccdCaseId)
                            .then(result => {
                                if (result.name === 'Error') {
                                    const commonContent = require(`app/resources/${req.session.language}/translation/common`);
                                    logger.error(`Error checking everyone has agreed: ${result.message}`);
                                    return res.status(500).render('errors/error', {common: commonContent, error: '500', userLoggedIn: req.userLoggedIn});
                                }
                                logger.info('Checking if all applicants have already agreed');
                                next();
                            });
                    } else {
                        next();
                    }
                });
        };
    }

    getAuth(req) {
        const authorise = new Authorise(config.services.idam.s2s_url, req.sessionID);

        return authorise.post()
            .then((serviceAuthorisation) => {
                if (serviceAuthorisation.name === 'Error') {
                    logger.info(`serviceAuthResult Error = ${serviceAuthorisation}`);
                    return [null, null];
                }

                const security = new Security();
                const hostname = FormatUrl.createHostname(req);

                return security.getUserToken(hostname)
                    .then((authToken) => {
                        if (authToken.name === 'Error') {
                            logger.info(`failed to obtain authToken = ${serviceAuthorisation}`);
                            return [null, null];
                        }

                        return [authToken, serviceAuthorisation];
                    })
                    .catch((err) => {
                        logger.info(`failed to obtain authToken = ${err}`);
                        return [null, null];
                    });
            })
            .catch((err) => {
                logger.info(`serviceAuthResult Error = ${err}`);
                return [null, null];
            });
    }
}

module.exports = InviteLink;
