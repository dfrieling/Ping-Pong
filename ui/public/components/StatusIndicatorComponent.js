/**
 * @jsx React.DOM
 */
'use strict';



var
    React = require('react'),
    classSet = require('classnames'),
    config = window.config;



class GameComponent extends React.Component {



    getInitialState() {
        return {};
    }



    componentDidMount() {
    }
    
    
    
    reset() {
        this.replaceState(this.getInitialState());
    }
    
    
    
    render() {
        
        var classes = classSet({
            'status-indicator': true,
            'status-indicator--unknown': typeof this.props.state === 'undefined',
            'status-indicator--positive': this.props.state || this.props.state === 'warning',
            'status-indicator--negative': typeof this.props.state !== 'undefined' && !this.props.state,
            'status-indicator--warning': this.props.state === 'warning'
        });
        
        return <div className={classes}></div>;   
    }

}