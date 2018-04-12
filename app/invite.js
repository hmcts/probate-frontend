'use strict';

/* eslint handle-callback-err: 0 no-unused-vars: 0*/

const config = require('app/config'),
    {asyncFetch, fetchOptions} = require('app/components/api-utils'),
    url = require('url'),
    services = require('app/components/services'),
    logger = require('app/components/logger')('Init'),
    {isEmpty} = require('lodash'),
    steps = require('app/core/initSteps').steps;

module.exports = class InviteLink {
    verify() {
        const self = this

        return function (req, res, next) {
            self.checkLinkIsValid(req, res,
                (res) => res.redirect('/sign-in'),
                (res) => res.redirect('/errors/404'))
        }
    }
    checkLinkIsValid(request, response, success, failure) {
        const inviteId = request.params.inviteId

        const isValidLink = services.findInviteLink(inviteId).then(result => {
            if (result.name === 'Error') {
                logger.error('Error while verifying the token: ' + result.message)
                failure(response)
            } else {
                logger.info('Link is valid')
                services.sendPin(result.phoneNumber, request.sessionID).then(generatedPin => {
                    request.session.pin = generatedPin
                    request.session.phoneNumber = result.phoneNumber
                    request.session.leadExecutorName = result.mainExecutorName
                    request.session.formdataId = result.formdataId
                    request.session.inviteId = inviteId
                    request.session.validLink = true
                    success(response)
                })
            }

        })
        .catch(err => {
            logger.error('Error while checking the link or sending the pin: ' + err)
            failure(response)
        })
    }

    checkCoApplicant(useIDAM) {
        return function (req, res, next) {
            if (useIDAM === 'true' && isEmpty(req.session.inviteId)) {
                res.status(404);
                res.render('errors/404');
            } else {
                services.checkAllAgreed(req.session.formdataId).then(result => {
                    if (result.name === 'Error') {
                        logger.error('Error checking everyone has agreed: ' + result.message)
                        res.status(500);
                        res.render('errors/500');
                    } else {
                        logger.info('Checking if all applicants have already agreed');
                        if (result === 'true') {
                            logger.info('All applicants have agreed');
                            const step = steps.CoApplicantAllAgreedPage;
                            const content = step.generateContent();
                            const common = step.commonContent();
                            const formdata = req.session.form;
                            if (formdata.will.codicils === 'Yes') {
                                content.paragraph4 = content['paragraph4-codicils'];
                            }
                            res.render(steps.CoApplicantAllAgreedPage.template, {content, common});
                        } else {
                            next();
                        }
                    }
                })
            }
        }
    }
}