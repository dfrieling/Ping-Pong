'use strict';



var
    util = require('util'),
    events = require('events'),
	PythonShell = require('python-shell');
    kFactor = require('../kFactor.js'),
    Player = require('../models/Player'),
    winningLeaderboardRank,
    losingLeaderboardRank,
    tip;

module.exports = function() {
    return this instanceof TrueskillComparator
        ? TrueskillComparator
        : new TrueskillComparator;
};



/**
 * TrueskillComparator
 */
function TrueskillComparator() {
    this.players = [];
    this.lowestRankedPlayer;
    this.tip;
};

util.inherits(TrueskillComparator, events.EventEmitter);



/**
 * Add Player
 */
TrueskillComparator.prototype.addPlayer = function(player, position) {
    
    if(this.players.length >= 2) {
        this.players = [];
    }
    
    this.players.push({
        id: player.get('id'),
        name: player.get('name'),
        gender: player.get('gender'),
        rank: player.get('trueskill_mu'),
        position: position,
        expectation: undefined,
        winningRank: undefined,
        losingRank: undefined,
        winningLeaderboardRank: undefined,
        losingLeaderboardRank: undefined
    });
    
    this.update();
    
};



/**
 * Emits a tip
 */
TrueskillComparator.prototype.emitTip = function() {

    var _this = this;

    if(this.lowestRankedPlayer) {
        this.emit('tip.playerWin', _this.lowestRankedPlayer);
    }

};




/**
 * Set the existing leaderboard
 */
TrueskillComparator.prototype.setLeaderboard = function(leaderboard) {
    this.leaderboard = leaderboard;
    this.update();
};



/**
 * If both players and the leaderboard is set, update the player info
 */
TrueskillComparator.prototype.update = function() {
    if(this.players.length >= 2 && typeof this.leaderboard !== 'undefined') {
        this.players = recalculate(this.players, this.leaderboard);
        this.lowestRankedPlayer = lowestRankedPlayer(this.players);
        this.emitTip();
    }
};



/**
 * Reset
 */
TrueskillComparator.prototype.reset = function() {
    this.players = [];
    this.tip = undefined;
};



/**
 * Gets the updated rank of a player if they beat or lose to a given opponent
 */
function leaderboardRank(method, subject, comparison, leaderboard) {
    
    var
        rank,
        methods = ['winningRank', 'losingRank'];
    
    if(method === 'losing') {
        methods.reverse();
    }

    leaderboard.forEach(function(player) {
        if(player.get('id') === subject.id) {
            player.set('elo', subject[ methods[0] ]);
        }
        if(player.get('id') === comparison.id) {
            player.set('elo', comparison[ methods[1] ]);
        }
    });

    leaderboard.comparator = function(player) {
        return -player.get('elo');
    };
    
    leaderboard.sort();
    
    rank = leaderboard.map(function(player) {
        return player.get('id');
    }).indexOf(subject.id) + 1;
    
    return rank;
    
}

winningLeaderboardRank = leaderboardRank.bind(undefined, 'winning');
losingLeaderboardRank = leaderboardRank.bind(undefined, 'losing');




/**
 * Recalculate player rankings
 */
function recalculate(players, leaderboard) {

    players[0].winningRank = trueskill.newRatingIfWon(players[0].rank, players[1].rank);
    players[0].losingRank = trueskill.newRatingIfLost(players[0].rank, players[1].rank);
    
    players[1].winningRank = trueskill.newRatingIfWon(players[1].rank, players[0].rank);
    players[1].losingRank = trueskill.newRatingIfLost(players[1].rank, players[0].rank);
    
    players[0].winningLeaderboardRank = winningLeaderboardRank(players[0], players[1], leaderboard);
    players[0].losingLeaderboardRank = losingLeaderboardRank(players[0], players[1], leaderboard);

    players[1].winningLeaderboardRank = winningLeaderboardRank(players[1], players[0], leaderboard);
    players[1].losingLeaderboardRank = losingLeaderboardRank(players[1], players[0], leaderboard);

    return players;

}



/**
 * Find lowest ranked player
 */
function lowestRankedPlayer(players) {
    
    var lowestRankingPlayer;
    
    players.forEach(function(player) {
        if(!lowestRankingPlayer || lowestRankingPlayer.rank > player.rank) {
            lowestRankingPlayer = player;
        }
    });
    
    return lowestRankingPlayer;
    
}
