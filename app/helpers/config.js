'use strict';

const _ = require('lodash');
let env = process.env;

/**
 * Get config form environment (define in file .env).
 *
 * @param key
 * @param defaultValue
 * @returns {*}
 */
module.exports = function getEnv(key, defaultValue) {
    return _.get(env, key, defaultValue);
};