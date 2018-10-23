'use strict';

const Step = require('app/core/steps/Step');

class Timeout extends Step {

    static getUrl () {
        return '/time-out';
    }

    getContextData(req) {
        req.session.destroy();
        delete req.cookies;
        delete req.sessionID;
        delete req.session;
        delete req.sessionStore;
    }
}

module.exports = Timeout;
