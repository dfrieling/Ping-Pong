// This should probably be a method on the game model

var
    app = require('../app'),
    bookshelf = app.get('bookshelf'),
    Player = require('../models/Player');

module.exports.get = function getLeaderboardJSON(limit) {

    limit = limit || 10;

    return Player
        .query((qb) => {
            qb.where('trueSkill_sigma', '<', '4')
            .andWhere('updated_at', '>', bookshelf.knex.raw(`now() - INTERVAL 1 MONTH`))
            .orderBy('trueSkill_mu', 'desc')
            .limit(limit)
        }).fetchAll();
};