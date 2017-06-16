'use strict';

const request = require('request');
const _ = require('lodash');
const helpers = global.helpers;
const config = helpers.config;

let PAGE_ACCESS_TOKEN = config('PAGE_ACCESS_TOKEN') || '';

function sendMessage(message, targetId) {
    let messageId = message.mid;

    let messageText = message.text;
    let messageAttachments = message.attachments;

    if (messageText) {
        sendTextMessage(messageText, targetId);
    }

    if (messageAttachments) {
        messageAttachments.forEach(function (attachment) {
            let payloadUrl = attachment.payload.url;
            if (attachment.type === 'image') {
                sendImageMessage(targetId, payloadUrl);
            } else if (attachment.type === 'audio') {
                sendBotMessage('Be careful!','Đối phương gửi tệp audio!', targetId);
                sendTextMessage(payloadUrl, targetId);
            } else {
                sendBotMessage('Be careful!','Đối phương muốn gửi một tệp nguy hiểm cho bạn!', targetId);
            }
        });
    }
}

function sendGenericMessage(recipientId) {
    let messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: [{
                        title: "rift",
                        subtitle: "Next-generation virtual reality",
                        item_url: "https://www.oculus.com/en-us/rift/",
                        image_url: "http://messengerdemo.parseapp.com/img/rift.png",
                        buttons: [{
                            type: "web_url",
                            url: "https://www.oculus.com/en-us/rift/",
                            title: "Open Web URL"
                        }, {
                            type: "postback",
                            title: "Call Postback",
                            payload: "Payload for first bubble",
                        }],
                    }, {
                        title: "touch",
                        subtitle: "Your Hands, Now in VR",
                        item_url: "https://www.oculus.com/en-us/touch/",
                        image_url: "http://messengerdemo.parseapp.com/img/touch.png",
                        buttons: [{
                            type: "web_url",
                            url: "https://www.oculus.com/en-us/touch/",
                            title: "Open Web URL"
                        }, {
                            type: "postback",
                            title: "Call Postback",
                            payload: "Payload for second bubble",
                        }]
                    }]
                }
            }
        }
    };

    callSendAPI(messageData);
}

function sendImageMessage(recipientId, imgUrl) {
    let messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            "attachment": {
                "type": "image",
                "payload": {
                    "url": imgUrl,
                    "is_reusable": true
                }
            }
        }
    };

    callSendAPI(messageData);
}

function sendTextMessage(messageText, recipientId) {
    let messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText
        }
    };

    callSendAPI(messageData);
}

function sendBotMessage(title, content, recipientId) {
    let messageData = {
        "recipient": {
            "id": recipientId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": title,
                            "subtitle": content
                        }
                    ]
                }
            }
        }
    };

    callSendAPI(messageData);
}

function callSendAPI(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: messageData

    }, function (err, response, body) {
        if (err || response.statusCode != 200) {
            console.error("Unable to send message.", err);
            console.error(messageData);
        }
    });
}


module.exports.sendMessage = sendMessage;
module.exports.sendImageMessage = sendImageMessage;
module.exports.sendTextMessage = sendTextMessage;
module.exports.sendBotMessage = sendBotMessage;