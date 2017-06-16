exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('users', function (table) {
            table.increments('id').unsigned();
            table.varchar('fb_id', 200).unique();

            table.index('id');
            table.index('fb_id');
        }),

        knex.schema.createTable('chat_sessions', function (table) {
            table.increments('id').unsigned();
            table.varchar('lhs_fb_id', 200);
            table.varchar('rhs_fb_id', 200);

            table.index('id');
        }),
    ])
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('users'),
        knex.schema.dropTable('chat_sessions')
    ])
};
