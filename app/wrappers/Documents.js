'use strict';

class Documents {
    constructor(documents) {
        this.documents = documents || {};
    }

    registryAddress() {
        return this.documents.registryAddress ? this.documents.registryAddress : '';
    }
}

module.exports = Documents;
