'use strict';

const request = require('request');
const _ = require('lodash');
const helpers = global.helpers;
const config = helpers.config;

// other services
const db = require('./database');
const msgSender = require('./message-sender');

let PAGE_ACCESS_TOKEN = config('PAGE_ACCESS_TOKEN') || '';

module.exports.handleMsgMaintain = function (data) {
    data.entry.forEach(function (entry) {

        // Iterate over each messaging event
        entry.messaging.forEach(function (event) {
            // test
            console.log(event);

            if (event.message) {
                receivedMessageMaintain(event);
            } else {
                console.log("Webhook received unknown event: ", event);
            }
        });
    });
};

module.exports.handleMsg = function (data) {

    // Iterate over each entry - there may be multiple if batched
    data.entry.forEach(function (entry) {
        // let pageID = entry.id;
        // let timeOfEvent = entry.time;

        // Iterate over each messaging event
        entry.messaging.forEach(function (event) {
            if (event.message) {
                receivedMessage(event);
            } else {
                console.log("Webhook received unknown event: ", event);
            }
        });
    });
};

function receivedMessageMaintain(event) {
    let senderID = event.sender.id;

    msgSender.sendBotMessage('Góc bảo trì, nâng cấp!', 'Mọi thông tin sẽ được cập nhật trên fanpage ^^. Cám ơn các bạn!', senderID);
}

function receivedMessage(event) {
    let senderID = event.sender.id;
    // let recipientID = event.recipient.id;
    // let timeOfMessage = event.timestamp;
    let message = event.message;

    // console.log("Received message for user %d and page %d at %d with message:",
    //     senderID, recipientID, timeOfMessage);
    // console.log(JSON.stringify(message));

    /**
     * Check tin nhắn tới có phải là tin nhắn kết thúc ko?
     * Nếu là tn 'pp' => 1. Loại bỏ session chat hiện tại của user đó và người cặp cùng
     *                => 2. Loại bỏ user trong hàng đợi xếp cặp
     *                => 3. Gửi thông báo kết thúc phiên TT
     */
    if (message.text && message.text.toLowerCase() === 'pp') {
        let pairSession;
        db.deletePairSession(senderID)
            .then(session => {
                pairSession = session;
            })
            .catch(err => {
                console.log(`receivedMessage: ${err}`);
            })
            .then(() => {
                return db.deleteUser(senderID);
            })
            .then(() => {
                // inform success msg to user
                msgSender.sendBotMessage('Bạn đã ngưng thả thính!', 'Gõ kí tự bất kì để bắt đầu thả thính ^^', senderID);

                if (pairSession) {
                    msgSender.sendBotMessage('Đối phương đã ngưng thả thính!', 'Gõ kí tự bất kì để bắt đầu thả thính ^^', pairSession.rhs_fb_id);
                }
            })
            .catch(err => {
                console.log(`receivedMessage: ${err}`);

                msgSender.sendBotMessage('Bạn đã ngưng thả thính!', 'Gõ kí tự bất kì để bắt đầu thả thính ^^', senderID);
                if (pairSession) {
                    msgSender.sendBotMessage('Đối phương đã ngưng thả thính!', 'Gõ kí tự bất kì để bắt đầu thả thính ^^', pairSession.rhs_fb_id);
                }
            });

        return;
    }


    db.findSession(senderID).then((session) => {
        if (_.isEmpty(session)) {
            /**
             * Kiểm tra User này có trong hàng đợi không
             * Nếu không có, chuyển user này vào hàng đợi => gửi thông báo thả thinhing...
             * Nếu có, không làm gì cả
             */
            db.findUser(senderID)
                .then(user => {
                    if (_.isEmpty(user)) {
                        checkAndInsertUser(senderID);
                    }
                })
                .catch(err => {
                    console.log(`receivedMessage: ${err}`);
                })
        } else {
            /**
             * Gửi tin nhắn tới người đang được ghép cặp với user này
             */
            db.findSession(senderID)
                .then(session => {
                    session = session.toJSON();

                    msgSender.sendMessage(message, session.rhs_fb_id);
                })
                .catch(err => {
                    console.log(`receivedMessage: ${err}`);
                });
        }
    }).catch((err) => {
        console.log(`receivedMessage: ${err}`);
    });
}

function checkAndInsertUser(senderId) {
    let user_info = {
        fb_id: senderId
    };

    db.insertUser(user_info)
        .then(newUser => {
            msgSender.sendBotMessage('Thả câu...', 'Đang tìm cá cho bạn thả thính...', senderId);
        })
        .catch(err => {
            msgSender.sendBotMessage('Thật không may!', 'Số lượng cần đang quá tải, chờ trong giây lát!', senderId);
            console.log(`checkAndInsertUser: ${err}`);
        });
}