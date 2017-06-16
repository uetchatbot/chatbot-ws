'use strict';

class Response {
    constructor(message, data, error, code) {
        this.message = message;
        this.error = error;
        this.statusCode = code;
        this.data = data;
    }
}

/**
 * Response success format.
 *
 * @param message
 * @param data
 * @param error
 * @param code
 * @returns {Response}
 */
module.exports = function response(message, data, error, code) {
    data = data || null;
    error = error || false;
    code = code || 200;

    return new Response(message, data, error, code);
};