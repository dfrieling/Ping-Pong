'use strict';

import PlayerComponent from "./PlayerComponent";
import StatsComponent from "./StatsComponent";
import StatusIndicatorComponent from "./StatusIndicatorComponent";
import StatusComponent from "./StatusComponent";

var
    React = require('react'),
    AmpersandState = require('ampersand-state'),
	slug = require('slug'),
    config = window.config,
    node = require('../js/node'),
    soundPath = '/sounds/',
    PlayerModel,
    playerProps,
	soundQueue = [],
	soundsPlaying = false,
    players = [];

// The beginnings of a model for sharing state between components
playerProps = {
    name: 'string',
    image: 'string',
};

PlayerModel = AmpersandState.extend({
    props: playerProps
});



export default class GameComponent extends React.Component {

    state = this.getInitialState();

    getInitialState() {
        return {
            server: undefined,
            winner: undefined,
            score: [0, 0],
            table: undefined,
            cardReader: undefined
        };
    }

    componentDidMount() {

        node.socket.on('game.end', this.end);
        node.socket.on('game.score', this.score);
        node.socket.on('game.reset', this.reset);
        node.socket.on('game.gamePoint', this.gamePoint);

        node.socket.on('game.switchServer', (data) => {
            this.switchServer(data.player, data.nextServer);
        });

        node.socket.on('feelers.disconnect', this.tableDisconnected);
        node.socket.on('feelers.connect', this.tableConnected);
        node.socket.on('core.batteryLow', this.tableBatteryLow);

        node.socket.on('cardReader.connect', this.cardReaderConnected);
        node.socket.on('cardReader.disconnect', this.cardReaderDisconnected);

        node.socket.on('player.join', (data) => {
            console.log(['player.join', data.player.name]);
            players[data.position] = new PlayerModel();
            players[data.position].set(data.player);
        });

        node.socket.on('player.rematch', () => {
            console.log('received rematch event');
            this.rematch();
        });

    }


    rematch() {
        //this.queueSound('proceed');
    }


    switchServer = (player, nextServer) => {
        this.setState({
            server: player
        });

        this.setState({
            nextServer: nextServer
        });

        const playerSound = players[player].name;

        // cut down the delay between "player X to serve" and the score announcement by 500 ms
        this.queueSound(slug(playerSound.toLowerCase()) + '-to-serve', -500);
    }


    score = (data) => {

        this.setState({
            score: data.gameScore
        });

        this.queueSound('scored');

        // This is really counterintuitive, and far from a permanent
        // solution. This small delay allows us to cancel the score
        // announcement. For example, when a service change occurs,
        // we want to defer the score announcement to after the
        // service change announcement.
        setTimeout(() => {
            this.announceScore();
        }, 500);

    }


    gamePoint = (data) => {

        var
            player = data.player,
            playerSound;

        // delayed so it happens after the score announcements
        setTimeout(() => {
            // if winner is clear already don't say game point again
            if (typeof this.state.winner === 'undefined') {
                playerSound = players[player].name;
                this.queueSound('game-point-' + slug(playerSound.toLowerCase()));
            }
        }, 600);
    }

    announceScore() {

        var announcement = this.state.score;

        if (typeof this.state.winner === 'undefined' && (announcement[0] > 0 || announcement[1] > 0)) {
            // Announce the server's score first
            if (this.state.server == 1) {
                announcement.reverse();
            }

            // cut down the delay between the score announcements of the two sides
            this.queueSound('' + announcement[0], -500);
            this.queueSound('' + announcement[1]);
        }

    }


    end = (data) => {

        var playerSound = '';

        this.resetQueue();

        this.setState({winner: data.winner});

        this.queueSound('game_end');

//	this.queueSound(data.winner % 2 == 0 ? 'blue-team-dominating' : 'red-team-dominating');
        this.queueSound(slug(playerSound).toLowerCase() + '-won-the-game');
    }

    resetQueue() {
        soundQueue = [];
    }

    queueSound(sound, offset, cb) {
        soundQueue.push({
            name: sound,
            offsetNext: typeof offset === 'undefined' ? 0 : offset,
            cb: cb
        });
        this.playQueue();
    }

    playQueue() {

        var
            play;

        if (soundsPlaying) {
            return;
        }

        soundsPlaying = true;

        play = function () {

            var
                sound = {},
                offset = 0;

            if (soundQueue.length > 0) {
                sound = soundQueue.shift();
                var audio = new Audio(soundPath + sound.name + ".wav");
                audio.addEventListener('loadedmetadata', function () {
                    var duration = audio.duration;
                    offset = sound.offsetNext ? duration * 1000 + sound.offsetNext : duration * 1000;
                    audio.play();
                    setTimeout(function () {
                        play();
                        if (sound.cb) {
                            sound.cb();
                        }
                    }, offset);
                });
                audio.addEventListener('error', function () {
                    play();
                });
            } else {
                soundsPlaying = false;
            }

        }

        play();

    }

    tableConnected = () => {
        this.setState({
            table: true
        });
    }


    tableDisconnected = () => {
        this.setState({
            table: false
        });
    }


    cardReaderConnected = () => {
        this.setState({
            cardReader: true
        });
    }


    cardReaderDisconnected = () => {
        this.setState({
            cardReader: false
        });
    }


    tableBatteryLow = () => {
        this.setState({
            table: 'warning'
        });
    }

    reset = () => {
        setTimeout(() => {
                players = [];
            }, 1500
        );

        this.setState(this.getInitialState());
    }

    render() {
        return (
            <div>
                <div className='player_container'>
                    <PlayerComponent positionId='0' players={players} server={this.state.server}
                                     winner={this.state.winner} nextServer={this.state.nextServer}/>
                    <PlayerComponent positionId='1' players={players} server={this.state.server}
                                     winner={this.state.winner} nextServer={this.state.nextServer}/>
                    <StatusComponent main='true'/>
                </div>
                <StatsComponent players={players} server={this.state.server} score={this.state.score}/>
                <div className='status-indicators'>
                    <StatusIndicatorComponent state={this.state.table}/>
                    <StatusIndicatorComponent state={this.state.cardReader}/>
                </div>
            </div>

        );
    }
}