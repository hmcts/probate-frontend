'use strict';

class Documents {
    constructor(documentsData) {
        this.documentsData = documentsData || {};
    }

    documentsSent() {
        return this.documentsData.sentDocuments === 'true';
    }
}

module.exports = Documents;
