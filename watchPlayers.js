var
    path = require('path'),
    fs = require('fs'),
    request = require('request'),
    async = require('async'),
    slug = require('slug'),
    config = require('./config.js'),
    gutil = require('gulp-util');

interval = 1000;

gutil.log('updating sounds...');
var playersJson = undefined;

async.forever(
	function(next) {
		try {
			watchPlayers(
				function() {
					setTimeout(function() {
						next();
					}, interval)
				}, 
				function() {
					updateSounds(function(err,stdout,stderr) { 
						gutil.log('finished updating sounds');
						setTimeout(function() {
							next();
						}, interval);
					});
				}
			);
		} catch (ex) {
			gutil.log('watch players came across error: ' + ex);
		}
	},
	function(err) {
		gutil.log('encountered error: ' + error);
		process.exit();
	}
);

function watchPlayers(loopCb, cbOnUpdate) {
	var Player = require('./models/Player');
	Player.fetchAll().then(function(players) { 
		currentPlayersJson = JSON.stringify(players.toJSON());

		if(currentPlayersJson != playersJson) {
			playersJson = currentPlayersJson;
			gutil.log('change in player DB detected, retriggering sound downloading process...');
			cbOnUpdate();
		}
		loopCb();
	}); 
}

function updateSounds(cb) {
    var
        Player = require('./models/Player'),
        scoreRange = [0, 40],
        announcements = [],
        downloads = [];

    announcements = [
        function(player) {
            return player + ' to serve';
        },
        function(player) {
            return 'Game point, ' + player;
        },
        function(player) {
            return player + ' won the game!';
        }
    ];
    
	async.parallel([

        function(cb) {
            Player.fetchAll().then(function(players) {
                async.each(players.toJSON(), function(player, cb) {
                    fetchAnnouncements(player.name, function(res) {
                        if(res.writable) {
                            gutil.log("pushing announcements for " + player.name + " to download queue..");
                            downloads.push(res);
                        }
                        cb();
                    });
                }, cb);
            });
        },

        function (cb) {
            let i = 0;

            async.whilst(
                (cb) => cb(null, i < scoreRange[1]) ,
                (cb) => {
                    getTTS(i, function (res) {
                        if (res.writable) {
                            gutil.log("pushing tts of " + i + " to download queue");
                            downloads.push(res);
                        }
                        i++;
                        cb();
                    });
                },
                cb);
        }

    ]);

    function fetchAnnouncements(player, cb) {
        async.each(announcements, function(announcement, cb) {
            announcement = announcement(player);
            getTTS(announcement, cb);
        }, cb);
    }
}

function getTTS(phrase, cb) {
    var
	    requestURL = 'http://api.voicerss.org/?key=' + config.global.tts.key + '&hl=' + config.global.tts.language + '&f=16khz_16bit_stereo&c=wav&src=' + phrase,
        fileName = slug(phrase).toLowerCase() + '.wav',
        filePath = path.join('./ui/public/sounds/', fileName),
        res = true;

    fs.exists(filePath, function(exists) {
        if(!exists) {
            gutil.log("does not exist, building res from url="+requestURL);
            res = request(requestURL);
            res.on('response', function(response) {
                gutil.log("downloaded "+requestURL+", status code=" + response.statusCode + " content-type: " + response.headers['content-type'] + " length:" + response.headers['content-length'])
                if(response.headers['content-type'] == "audio/wav" && response.headers['content-length'] > 0) {
                    response.pipe(fs.createWriteStream(filePath));
                } else {
                    gutil.log("problem, see above, not saving it");
                }
            });
        }
        cb(res);
    });

}



