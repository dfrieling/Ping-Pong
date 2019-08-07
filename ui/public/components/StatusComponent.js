/**
 * @jsx React.DOM
 */
'use strict';



var
    React = require('react'),
    ReactCSSTransitionGroup = require('preact-css-transition-group'),
    config = window.config,
    node = require('../js/node');



class GameComponent extends React.Component {



    getInitialState() {
        return {
            error: false,
            important: false,
            message: ''
        };
    }



    componentDidMount() {

        var _this = this;
        
        node.socket.on('core.batteryLow', _this.batteryLow);
        node.socket.on('core.online', _this.batteryReplenished);
        node.socket.on('game.cardReadError', _this.cardReadError);
        
        node.socket.on('game.message', function(data) {
            _this.info(data.message);
        });
        
        node.socket.on('game.playerNotFound', function(data) {
            _this.playerNotFound(data);
        });

        node.socket.on('game.end', function() {
            setTimeout(_this.clearInfo, config.winningViewDuration);
        });

    }
    
    
    
    error(error, timeout, important) {

        if(this.state.important && !important) {
            return;
        }
        
        this.setState({
            error: true,
            message: error
        });
        
        if(important) {
            this.setState({
                important: true
            });
        }
        
        if(typeof timeout !== 'undefined') {
            setTimeout(this.resolveError, timeout);
        }
        
    }



    importantError(error) {
        return this.error(error, undefined, true);
    }
    
    
    
    info(message) {

        if(this.state.important) {
            return;
        }
    
        this.setState({
            error: false,
            message: message
        });

    }
    
    
    
    resolveError() {
        if(this.state.error) {
            this.reset();
        }
    }
    
    
    
    cardReadError() {
        this.error('Card reader error', 3000);
    }
    
    
    
    batteryLow() {
        this.importantError('Table batteries low');
    }
    
    
    
    batteryReplenished() {
        this.resolveError();
    }
    
    
    
    playerNotFound(data) {
        this.error('Player with ' + data.attr + ' ' + data.value + ' not found', 3000);
    }
    
    
    
    clearInfo() {
        if(!this.state.error) {
            this.reset();
        }
    }
    
    
    
    reset() {
        this.replaceState(this.getInitialState());
    }
    
    
    
    render() {
        
        var
            classes = 'info',
            innerClasses = 'info__inner',
            status = <div></div>,
            message;
        
        if(this.state.error) {
            classes += ' error';
        }
        
        if(this.props.mini) {
            classes += ' info--mini';
        }
        
        if(this.props.main) {
            classes += ' info--main';
        }
        
        if(this.state.important) {
            classes += ' info--important';
        }
        
        // Here we set the inner HTML, as the server may be sending
        // an HTML chunk rather than just a string of text
        if(this.state.message !== '') {
            message = '<div class="' + innerClasses + '">' + this.state.message + '</div>';
            status = <div className={classes} dangerouslySetInnerHTML={{ __html: message }} key='status'></div>;
        }
        
        // transitionEnter and transitionLeave are disabled for important errors - the infinite animation
        // within screws with the ReactCSSTransitionGroup enclosing it.
        return (
            <ReactCSSTransitionGroup transitionName='status' transitionEnter={this.state.important} transitionLeave={this.state.important}>
                {status}
            </ReactCSSTransitionGroup>
        );
        
    }
    

    
}