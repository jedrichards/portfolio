"use strict";

exports.random = function (min,max) {

    return Math.random()*(max-min) + min;
};

exports.randomInt = function (min,max) {

    return Math.floor(Math.random()*(max-min+1))+min;
};

exports.inRange = function (value,min,max)
{
    return !!(( value>=min && value<=max ));
};

exports.limit = function (value,min,max)
{
    return Math.min(max,Math.max(min,value));
};

exports.normalise = function (value,min,max)
{
    return (value-min)/(max-min);
};

exports.interpolate = function (value,min,max)
{
    return min+(max-min)*value;
};

exports.map = function (value,valueMin,valueMax,targetMin,targetMax)
{
    return exports.interpolate(exports.normalise(value,valueMin,valueMax),targetMin,targetMax);
};