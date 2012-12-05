"use strict";

var mathUtils = require("./math-utils");

exports.shuffle = function(array) {

    var len = array.length;

    for ( var i=0; i<len; i++ ) {
        var rand = mathUtils.randomInt(0,len-1);
        var temp = array[i];
        array[i] = array[rand];
        array[rand] = temp;
    }
};