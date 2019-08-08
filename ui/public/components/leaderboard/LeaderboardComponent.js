'use strict';



var
    React = require('react'),
    config = window.config,
    node = require('../../js/node');



export default class LeaderboardComponent extends React.Component {

    state = {
        players: [],
        active: true
    }

    componentDidMount = () => {
        
        this.getLeaderboard();

        // todo: those lines used to be commented out
        node.socket.on('leaderboard.show', this.show);
        node.socket.on('leaderboard.hide', this.hide);
    }
    
    show = () => {
        this.getLeaderboard();
        this.setState({
            active: true
        });
    }
    
    
    
    hide = () => {
        this.setState({
            active: false
        });
    }
    
    
    
    getLeaderboard = () => {
        var _this = this;
        $.get(config.clientUrl + '/leaderboard', function(players) {
            _this.setState({
                players: players
            });
        });
    }



    render = () => {

        var
            players,
            leaderboard;

        players = this.state.players.map(function(player, i) {
            return (
                <li className='leaderboard__player' key={player.id}>
                    <div className='leaderboard__player__inner'>
                        <div className='leaderboard__player__name'>{i + 1}. {player.name}</div>
                    </div>
                </li>
            );
        });
        
        if(this.state.active) {
            leaderboard = (
                <div className='leaderboard' key='leaderboard'>
                    <ol>
                        {players}
                    </ol>
                </div>
            );
        }

        return leaderboard;

    }
}