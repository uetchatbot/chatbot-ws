'use strict';

const _ = require('lodash');
const Boom = require('boom');
const Models = global.Models;
const bcrypt = require('bcrypt');
const Joi = require('joi');
const ResponseJSON = global.helpers.ResponseJSON;
const service = require('../../services');

/**
 * [GET] /webhook/?hub.challenge=<facebook-token>&hub.verify_token=uetchatbotws
 * @type {{handler: exports.verifyWebhook.handler}}
 */

module.exports.verifyWebhook = {
    handler: function (req, rep) {
        let params = req.query;

        if (_.isEmpty(params) || _.isEmpty(params['hub.challenge'])) {
            return rep(Boom.badData('params is undefined!'));
        }

        return rep(params['hub.challenge']);
    }
};

/**
 * handler receiver msg
 * @type {{handler: exports.receiveMessage.handler}}
 */
module.exports.receiveMessage = {
    handler: function (req, rep) {
        let data = req.payload;

        // Make sure this is a page subscription
        if (data.object === 'page') {

            service.webhook.handleMsg(data);
            // service.webhook.handleMsgMaintain(data);

            return rep(ResponseJSON('Success'));
        }

        return rep(Boom.badData('Something went wrong!'));
    }
};