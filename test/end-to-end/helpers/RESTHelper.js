let request = require('unirest');

class RESTHelper extends codecept_helper {
    doHttpGet (url) {
        return request.get(url)
            .then((body) => {
                return body;
            });
    }
}

module.exports = RESTHelper;