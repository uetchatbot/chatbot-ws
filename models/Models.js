'use strict';

const bookshelf = require('../config/bookshelft').bookshelf;

let User = module.exports.User = bookshelf.Model.extend({
    tableName: 'users',
});

let ChatSession = module.exports.ChatSession = bookshelf.Model.extend({
    tableName: 'chat_sessions',
});