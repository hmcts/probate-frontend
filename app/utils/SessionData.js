'use strict';

const config = require('app/config');
const services = require('app/components/services');

class SessionData {
    getFormdata(req, next, cb) {
        if (!req.session.form) {
            req.log.info('Failed to load session data');
            req.session.back = [];
            const loadedData = services.loadFormData(req.session.regId);
            if (loadedData) {
                loadedData.then((result) => {
                    cb(req, result);
                    next();
                });
            } else {
                SessionData.setDefaultSessionData(req);
                next();
            }
        } else {
            next();
        }
    }

    setFormdata(req, result) {
        req.log.info('Checking for existing user data');
        if (result.name === 'Error') {
            req.log.info('User data not found - creating new session data');
            req.log.info({tags: 'Analytics'}, 'Application Started');
            SessionData.setDefaultSessionData(req);
        } else {
            req.log.info('User data found - creating new session from user data');
            req.session.form = result.formdata;
        }
    }

    static setDefaultSessionData(req) {
        req.session.form = {
            payloadVersion: config.payloadVersion,
            applicantEmail: req.session.regId
        };
    }
}

module.exports = SessionData;
