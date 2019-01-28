'use strict';

const probate = require('./probate');

// const taskList = {

// };

// const stepList = {

// };

const taskList = probate.taskList;
const stepList = probate.stepList;

module.exports.stepList = stepList;
module.exports.taskList = taskList;
