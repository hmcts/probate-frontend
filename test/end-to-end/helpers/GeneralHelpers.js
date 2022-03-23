function decodeHTML(str) {
    return str.replace(/&([a-zA-Z]+);/g,
        tag => ({
            '&rsquo;': '’',
            '&lsquo;': '‘',
            '&iuml;': 'ï',
            '&acirc;': 'â',
            '&ecirc;': 'ê',
            '&icirc;': 'î',
            '&ocirc;': 'ô',
            '&ucirc;': 'û',
            '&wcirc;': 'ŵ',
            '&ycirc;': 'ŷ',
        }[tag]));
}

module.exports = {
    decodeHTML
};
