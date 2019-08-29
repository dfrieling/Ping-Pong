'use strict';

import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

var node = require('../js/node');



export default class PlayerComponent extends React.Component {

    state = this.getInitialState();

    getInitialState() {
        return {
            name: '',
            score: 0,
            image: false,
            win: false,
            gamePoint: false,
            gamePointVisible: true
        };
    }

    componentDidMount() {
        node.socket.on('game.score', (data) => {
            if(data.player % 2 == this.props.positionId) {
                this.score(data.score);
            }
        });

        node.socket.on('game.gamePoint', (data) => {
            if(data.player % 2 == this.props.positionId) {
                this.gamePoint();
            } else {
                this.gamePoint(false);
            }
        });
        
        node.socket.on('game.notGamePoint', () => {
            this.gamePoint(false);
        });
        
        node.socket.on('game.cancelPoint', (data) => {
            if(data.player % 2 == this.props.positionId) {
                this.cancelPoint(data.score);
            }
        });

        node.socket.on('game.end', (data) => {
            if(data.winner % 2 == this.props.positionId) {
                return this.win();
            }
            this.lose();
        });

        node.socket.on('game.reset', () => {
            setTimeout(this.reset, 1500);
        });

    }

    score = (score) => {
        this.setState({
            score: score
        });
    }

    cancelPoint = (score) => {
        this.setState({
            score: score
        });
    }

    gamePoint = (isGamePoint) => {
        
        isGamePoint = typeof isGamePoint === 'undefined' ? true : isGamePoint;
        
        if(isGamePoint) {
        
            this.setState({
                gamePoint: true
            });
            
            if(typeof this.pulse === 'undefined') {
                this.pulse = setInterval(() => {
                    if(this.props.server % 2 == this.props.positionId) {
                        this.setState({
                            gamePointVisible: !this.state.gamePointVisible
                        });
                    }
                }, 900);
            }
            
        } else {
            
            this.setState({
                gamePoint: false,
                gamePointVisible: true
            });
            
            clearTimeout(this.pulse);
            this.pulse = undefined;
            
        }
        
    }

    win = () => {
        
        this.gamePoint(false);
        
        this.setState({
            win: true,
            serving: false
        });
        
    }

    lose = () => {
        
        this.gamePoint(false);
        
        this.setState({
            win: false,
            serving: false
        });
        
    }

    reset = () => {
        this.gamePoint(false);
        this.setState(this.getInitialState());
    }

    getPlayerOrder(a, b) {
        return (!( typeof this.props.server !== 'undefined' && typeof this.props.nextServer !== 'undefined') ||
        ( typeof this.props.server !== 'undefined' && typeof this.props.nextServer !== 'undefined'
            && this.props.players[this.props.nextServer].name != a.name && this.props.players[this.props.server].name
            != a.name
        )) ? -1 : 1;
    }

    render() {
        var
            playerClasses,
            style = {},
            status,
            statusClasses = 'status status--serving',
            gamePoint,
            gamePointClasses = 'status status--game-point',
            details,
            winner;

        if(!this.state.name && typeof this.props.players[this.props.positionId] !== 'undefined' && this.props.players[this.props.positionId].image) {
            style = {
                'backgroundImage':
                    this.props.players
                        .filter((v,i) => {return i%2 == this.props.positionId })
                        .sort((a,v) => { return this.getPlayerOrder(a, v); })
                        .map(function(v) { return 'url(img/players/' + v.image + ')'; })
                        .join(', '),
                'backgroundPosition':
                    this.props.players
                        .filter((v,i) => {return i%2 == this.props.positionId })
                        .length > 1 ? 'bottom left, bottom right' : ''
            }
        }

		if(this.state.win) {
            style = {
                'backgroundImage':
                    this.props.players
                        .filter((v,i) => {return i%2 == this.props.positionId })
                        .sort((a,v) => { return this.getPlayerOrder(a, v); })
                        .map(function(v) { return 'url(img/players/win/' + v.image + ')'; })
                        .join(', '),
                'backgroundPosition':
                    this.props.players
                        .filter((v,i) => {return i%2 == this.props.positionId })
                        .length > 1 ? 'bottom left, bottom right' : ''
            }
		}

        playerClasses = 'player player_' + this.props.positionId;

        if(this.props.server % 2 == this.props.positionId && !this.state.win) {
            status = <div className={statusClasses}>{this.props.players[this.props.server].name}</div>;
        }
        
        if(this.state.win && !this.state.lose) {
            playerClasses += ' win';
        }
        
        if(this.state.lose) {
            playerClasses += 'loses';
        }
        
        if(!this.state.win) {
            details = (
                <div className='details'>
                    <div className='score'>{this.state.score}</div>
                    <div className='name'>{(this.props.players.length && this.props.players
                        .filter((v,i) => {return i%2 == this.props.positionId })
                        .sort((a,v) => { return this.getPlayerOrder(a, v); })
                        .map(function(v) { return v.name; })
                        .join(' & ')) || 'Add player'}</div>
                </div>
            );
        }
        
        if(this.state.gamePointVisible) {
            gamePointClasses += ' status--visible';
        } else {
            gamePointClasses += ' status--hidden';
        }
        
        if(this.state.gamePoint && !this.state.win) {
            gamePoint = <div className={gamePointClasses}>Game Point</div>;
        }
        
        if(this.state.win) {
            winner = (
                <div className='winner'>{this.props.players.filter((v,i) => {return i%2 == this.props.positionId;}).map(function(v) { return v.name; }).join(' & ')} {this.props.players.length > 2 ? 'win' : 'wins'}</div>
            );
        }

        return (
            <div className={playerClasses} style={style}>
                <div className='status'></div>
                {status}
                {gamePoint}
                {details}
                <ReactCSSTransitionGroup transitionName='winner-announcement' transitionEnterTimeout={500} transitionLeaveTimeout={500}>
                    {winner}
                </ReactCSSTransitionGroup>
            </div>
        );

    }
}
