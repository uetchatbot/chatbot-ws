
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('chat_sessions').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('chat_sessions').insert({id: 1, lhs_fb_id: '1', rhs_fb_id: '2'}),
        knex('chat_sessions').insert({id: 2, lhs_fb_id: '2', rhs_fb_id: '1'}),
        knex('chat_sessions').insert({id: 3, lhs_fb_id: '3', rhs_fb_id: '4'}),
        knex('chat_sessions').insert({id: 4, lhs_fb_id: '4', rhs_fb_id: '3'}),
      ]);
    });
};
