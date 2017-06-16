'use strict';

module.exports.register = (server, options, next) => {
    let controller = require('./../controllers');

    server.route([
        /**
         * Any request OPTIONS
         */
        {
            path: '/{text*}',
            method: ['OPTIONS'],
            config: {
                handler: function(request, reply) {
                    return reply().code(204);
                }
            }
        },

        // facebook
        {
            method : ['GET'],
            path: '/webhook',
            config: controller.fbHook.verifyWebhook
        },
        {
            method : ['POST'],
            path: '/webhook',
            config: controller.fbHook.receiveMessage
        }

    ]);
};

module.exports.register.attributes = {
    name: 'Chatbot Router',
    version: '1.0.0'
};