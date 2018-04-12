'use strict';
const requireDir = require('require-directory'),
      i18next = require('i18next'),
      logger = require('app/components/logger')('Init');

const steps = {};

let content = {};


const initSteps = (stepLocations) => {

    content = requireDir(module, '../', {include: /resources/});
    i18next.createInstance();
    i18next.init(content, (err) => {
        if (err) {
            logger.error(err);
        }
    });

    stepLocations.forEach((location) => {
        const calculatePath = path => {
            if (/index.js$/.test(path)) {
                const step = initStep(path);
                steps[step.name] = step;
                return true;
            }
            return false;
        }
        requireDir(module, location, {include: calculatePath});
    });

    return steps;
};

const initStep = path => {
    const stepObject = require(path);
    const pathFragments = path.search('ui') >= 0 ? path.split('/ui/') : path.split('/action/');
    let resourcePath = pathFragments[1];
    resourcePath = resourcePath.replace('/index.js', '');
    const section = resourcePath.split('/');
    if (section.length > 1) {
        section.pop();
    }
    const schemaPath = path.replace('index.js', 'schema');
    let schema;
    try {
        schema = require(schemaPath);
    } catch (e) {
        schema = {};
    }
    return new stepObject(steps, section.toString(), resourcePath, i18next, schema);
}

module.exports = initSteps;
module.exports.steps = steps;