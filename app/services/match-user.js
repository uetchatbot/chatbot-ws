'use strict';

const _ = require('lodash');
const async = require('async');
const helpers = global.helpers;
const config = helpers.config;

// other services
let db = require('./database');
let msgSender = require('./message-sender');

module.exports.randomMatchUser = function () {
    return new Promise((resolve, reject) => {
        db.findAllUser().then(users => {
            users = users.toJSON();

            let pairArr = [];

            for (let i = 0; i < users.length - 1; i += 2) {
                let pair = {
                    lhs_fb_id: users[i].fb_id,
                    rhs_fb_id: users[i + 1].fb_id
                };

                console.log('match users: ', pair);

                pairArr.push(pair);
            }

            matchPairUser(pairArr)
                .then(resolve)
                .catch(reject);
        }).catch(reject);
    })
};

function matchPairUser(pairUserArr) {
    return new Promise((resolve, reject) => {
        async.each(
            pairUserArr,

            function (pairUser, cb) {
                // => delete user khỏi danh sách hàng đợi
                db.deleteUsers(pairUser.lhs_fb_id, pairUser.rhs_fb_id)
                    .then(() => {
                        // => insert chat session
                        return db.insertPairSession(pairUser.lhs_fb_id, pairUser.rhs_fb_id);
                    })
                    .then(() => {
                        msgSender.sendBotMessage('Done!', 'Cá đã cắn câu, hãy giật cần đi nào =)) Gõ pp để kết thúc.', pairUser.lhs_fb_id);
                        msgSender.sendBotMessage('Done!', 'Cá đã cắn câu, hãy giật cần đi nào =)) Gõ pp để kết thúc.', pairUser.rhs_fb_id);

                        cb();
                    })
                    .catch(cb);
            },

            function (err) {
                if (err) {
                    return reject(err);
                }

                return resolve('Ghep doi thanh cong!');
            });
    })
}