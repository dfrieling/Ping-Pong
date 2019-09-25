require('./modernizr');

import ReactDOM from 'react-dom';
import React from "react";
import GameComponent from "../components/GameComponent";

var
    node = require('./node.js');

$(function() {
    ReactDOM.render(<GameComponent/>, document.getElementById('game'));
});

function debug(msg, data, consoleOnly) {
    if(consoleOnly === undefined) $('#debug').prepend(msg+'<br>');
    if(data !== undefined) console.log(msg, data);
}