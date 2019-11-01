'use strict';

const logger = require('app/components/logger')('Init');
const {isEmpty} = require('lodash');
const steps = require('app/core/initSteps').steps;
const InviteLinkService = require('app/services/InviteLink');
const AllExecutorsAgreed = require('app/services/AllExecutorsAgreed');
const config = require('app/config');
const PinNumber = require('app/services/PinNumber');
const Security = require('app/services/Security');
const Authorise = require('app/services/Authorise');
const FormatUrl = require('app/utils/FormatUrl');

class InviteLink {
    verify() {
        const self = this;

        return (req, res) => {
            self.checkLinkIsValid(req, res,
                (res) => res.redirect('/sign-in'),
                (res) => res.redirect('/errors/404'));
        };
    }

    checkLinkIsValid(req, res, success, failure) {
        this.getAuth(req)
            .then(([authToken, serviceAuthorisation]) => {
                if (authToken === null || serviceAuthorisation === null) {
                    logger.error('Error while getting the authToken and serviceAuthorisation');
                    failure(res);
                } else {
                    const inviteId = req.params.inviteId;
                    const inviteLink = new InviteLinkService(config.services.orchestrator.url, req.sessionID);

                    inviteLink.get(inviteId, authToken, serviceAuthorisation)
                        .then(result => {
                            if (result.name === 'Error') {
                                logger.error(`Error while verifying the token: ${result.message}`);
                                failure(res);
                            } else {
                                logger.info('Link is valid');
                                const pinNumber = new PinNumber(config.services.orchestrator.url, req.sessionID);
                                pinNumber.get(result.phoneNumber, authToken, serviceAuthorisation)
                                    .then(generatedPin => {
                                        req.session.pin = generatedPin;
                                        req.session.phoneNumber = result.phoneNumber;
                                        req.session.leadExecutorName = result.mainExecutorName;
                                        req.session.formdataId = result.formdataId;
                                        req.session.inviteId = inviteId;
                                        req.session.validLink = true;
                                        success(res);
                                    });
                            }
                        })
                        .catch(err => {
                            logger.error(`Error while checking the link or sending the pin: ${err}`);
                            failure(res);
                        });
                }
            })
            .catch(err => {
                logger.error(`Error while getting the authToken and serviceAuthorisation: ${err}`);
                failure(res);
            });
    }

    checkCoApplicant(useIDAM) {
        return (req, res, next) => {
            if (useIDAM === 'true' && isEmpty(req.session.inviteId)) {
                res.status(404);
                return res.render('errors/404');
            }

            this.getAuth(req, res)
                .then(([authToken, serviceAuthorisation]) => {
                    const ccdCaseId = req.session.form && req.session.form.ccdCase ? req.session.form.ccdCase.id : 'undefined';
                    const allExecutorsAgreed = new AllExecutorsAgreed(config.services.orchestrator.url, req.sessionID);

                    allExecutorsAgreed.get(authToken, serviceAuthorisation, ccdCaseId)
                        .then(result => {
                            if (result.name === 'Error') {
                                logger.error(`Error checking everyone has agreed: ${result.message}`);
                                res.status(500);
                                return res.render('errors/500');
                            }

                            logger.info('Checking if all applicants have already agreed');

                            if (result === 'true') {
                                logger.info('All applicants have agreed');
                                const step = steps.CoApplicantAllAgreedPage;
                                const content = step.generateContent();
                                const common = step.commonContent();
                                res.render(steps.CoApplicantAllAgreedPage.template, {content, common});
                            } else {
                                next();
                            }
                        });
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
