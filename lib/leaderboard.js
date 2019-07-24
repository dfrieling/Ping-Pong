// This should probably be a method on the game model

var
    app = require('../app'),
    bookshelf = app.get('bookshelf'),
    Player = require('../models/Player');



module.exports.get = function getLeaderboardJSON(limit) {

    limit = limit || 10;

    return Player
        .query('where', 'trueSkill_sigma', '<', '4')
        .query('orderBy', 'trueSkill_mu', 'desc')
        .query('limit', limit)
        .fetchAll();

};