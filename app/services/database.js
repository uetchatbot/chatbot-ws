'use strict';

const _ = require('lodash');
const async = require('async');
const Models = global.Models;
const knex = require('../../config/bookshelft').knex;
const helpers = global.helpers;
const config = helpers.config;

////////////// User ////////////////////

module.exports.findUser = function (fb_id) {
    return new Models.User({
        fb_id
    }).fetch();
};

module.exports.findAllUser = function () {
    return Models.User.fetchAll();
};

module.exports.insertUser = function (user_info) {
    return new Models.User(user_info).save();
};

module.exports.deleteUser = function (fb_id) {
    return new Models.User({fb_id}).fetch()
        .then(user => {
            if (_.isEmpty(user)) {
                return Promise.reject('None user is destroyed');
            } else {

                return Promise.resolve(user.toJSON());
            }
        })
        .then(user => {
            return new Models.User({id: user.id}).destroy();
        })
        .catch(err => {
            console.log(`deleteUser: ${err}`);

            return Promise.resolve();
        });
};

module.exports.deleteUsers = function (...lhs_fb_ids) {
    /**
     * không chắc chắn, có nên synchonomous?
     */
    return new Promise((resolve, reject) => {
        async.each(
            lhs_fb_ids,

            function (lhs_fb_id, cb) {
                knex('users')
                    .where('fb_id', '=', lhs_fb_id)
                    .del()
                    .then((count) => {
                        cb();
                    })
                    .catch(cb)
            },

            function (err) {
                if (err) {
                    return reject(err);
                }

                return resolve();
            });
    });
};

///////////// Chat Session /////////////////

module.exports.findSession = function (lhs_fb_id) {
    return new Models.ChatSession({
        lhs_fb_id: lhs_fb_id
    }).fetch();
};

module.exports.deleteChatSession = function (...lhs_fb_ids) {
    /**
     * không chắc chắn, có nên synchonomous?
     */
    return new Promise((resolve, reject) => {
        async.each(
            lhs_fb_ids,

            function (lhs_fb_id, cb) {
                new Models.ChatSession({
                    lhs_fb_id
                }).destroy().then(cb).catch(cb);
            },

            function (err) {
                if (err) {
                    return reject();
                }

                return resolve();
            });
    });
};

/**
 * Xóa phiên nói chuyện hiện tại của user
 * @return: {lhs_fb_id, rhs_fb_id}
 * @param sender_fb_id
 */
module.exports.deletePairSession = function (sender_fb_id) {
    return new Promise((resolve, reject) => {
        new Models.ChatSession({
            lhs_fb_id: sender_fb_id
        }).fetch()
            .then(session => {
                if (_.isEmpty(session)) {
                    return resolve();
                }

                knex('chat_sessions')
                    .where('lhs_fb_id', '=', sender_fb_id)
                    .orWhere('rhs_fb_id', '=', sender_fb_id)
                    .del()
                    .then(() => {
                        resolve(session.toJSON());
                    }).catch(reject);
            })
            .catch(reject);
    });
};

module.exports.insertPairSession = function (lhs_fb_id, rhs_fb_id) {
    return Promise.all([
        new Models.ChatSession({
            lhs_fb_id,
            rhs_fb_id
        }).save(),

        new Models.ChatSession({
            lhs_fb_id: rhs_fb_id,
            rhs_fb_id: lhs_fb_id
        }).save()
    ]);
};