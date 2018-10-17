const {chain} = require('lodash');

module.exports = (input) => {
    return chain(input)
        .words()
        .map((w) => {
            return w.charAt(0);
        })
        .value()
        .join(' ');
};
