const initialsFilter = require('app/components/initialsFilter');

module.exports = function(env) {

    // if you need accss to the internal nunjucks filter you can just env
    // see the example below for 'safe' which is used in 'filters.log'
    const nunjucksSafe = env.getFilter('safe');

    /**
   * object used store the methods registered as a 'filter' (of the same name) within nunjucks
   * filters.foo("input") here, becomes {{ "input" | foo }} within nunjucks templates
   * @type {Object}
   */

    /**
   * logs an object in the template to the console on the client.
   * @param  {Any} a any type
   * @return {String}   a script tag with a console.log call.
   * @example {{ "hello world" | log }}
   * @example {{ "hello world" | log | safe }}  [for environments with autoescaping turned on]
   */
    env.addFilter('log', function log(a) {
        return nunjucksSafe('<script>console.log(' + JSON.stringify(a, null, '\t') + ');</script>');
    });

    env.addFilter('initials', initialsFilter);

    return env;
};
