'use strict';

const Authorise = require('app/services/Authorise');
let authoriser;

class ServiceAuthoriser {

    constructor(endpoint, sessionId) {
        this.endpoint = endpoint;
        this.sessionId = sessionId;
        authoriser = new Authorise(this.endpoint, sessionId);
    }
    determineServiceAuthorizationToken() {
        return callServiceAuthorsiation();
    }
}

async function callServiceAuthorsiation() {

    let returnResult;
    await authoriser.post()
        .then((res) => {
            returnResult = res;
        });

    return returnResult;
}

module.exports = ServiceAuthoriser;
