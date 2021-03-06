'use strict';



var
    React = require('react'),
    classSet = require('classnames'),
    config = window.config;



export default class StatusIndicatorComponent extends React.Component {

    state = this.getInitialState();

    getInitialState() {
        return {};
    }

    componentDidMount() {
    }

    reset = () => {
        this.setState(this.getInitialState());
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