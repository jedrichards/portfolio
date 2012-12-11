var db = require("../../db/db.js");
var restify = require("restify");
var twitter = require("../services/twitter");
var foursquare = require("../services/foursquare");
var github = require("../services/github");
var lastfm = require("../services/lastfm");
var api = require("../api");
var async = require("async");

/**
 * Miscallaneous routes.
 */
module.exports = function (server) {

    "use strict";

    var twitterReqOptions = {
          host: "https://api.twitter.com",
          path: "/1/statuses/user_timeline.json?screen_name=jedrichards&count=1&exclude_replies=true"
    };

    return [
        {
            description: "Output the text 'ok' for server status monitoring",
            route: "/ping",
            method: "get",
            needsAuth: false,
            needsSession: false,
            handler: function (req,res,next) {
                res.end("ok");
                next();
            }
        },
        {
            description: "Output my latest tweet",
            route: "/twitter",
            method: "get",
            needsAuth: false,
            needsSession: true,
            handler: function (req,res,next) {
                twitter(function (err,doc) {
                    api.handleDatabaseResult(req,res,next,err,doc);
                });
            }
        },
        {
            description: "Output my latest Foursquare checkin",
            route: "/foursquare",
            method: "get",
            needsAuth: false,
            needsSession: true,
            handler: function (req,res,next) {
                foursquare(function (err,doc) {
                    api.handleDatabaseResult(req,res,next,err,doc);
                });
            }
        },
        {
            description: "Output my latest GitHub activity",
            route: "/github",
            method: "get",
            needsAuth: false,
            needsSession: true,
            handler: function (req,res,next) {
                github(function (err,doc) {
                    api.handleDatabaseResult(req,res,next,err,doc);
                });
            }
        },
        {
            description: "Output my latest last.fm activity",
            route: "/lastfm",
            method: "get",
            needsAuth: false,
            needsSession: true,
            handler: function (req,res,next) {
                lastfm(function (err,doc) {
                    api.handleDatabaseResult(req,res,next,err,doc);
                });
            }
        },
        {
            description: "Output all social activity",
            route: "/social",
            method: "get",
            needsAuth: false,
            needsSession: true,
            handler: function (req,res,next) {
                async.parallel([
                    function (cb) { twitter(cb); },
                    function (cb) { foursquare(cb); },
                    function (cb) { github(cb); },
                    function (cb) { lastfm(cb); }
                ],function (err,asyncRes) {
                    var doc = {
                        twitter: asyncRes[0],
                        foursquare: asyncRes[1],
                        github: asyncRes[2],
                        lastfm: asyncRes[3]
                    };
                    api.handleDatabaseResult(req,res,next,err,doc);
                });
            }
        }
    ];
};