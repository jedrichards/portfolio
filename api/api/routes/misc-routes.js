var db = require("../../db/db.js");
var restify = require("restify");
var twitter = require("../services/twitter");
var api = require("../api");

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
            route: "/tweet",
            method: "get",
            needsAuth: false,
            needsSession: true,
            handler: function (req,res,next) {
                twitter(function (err,doc) {
                    api.handleDatabaseResult(req,res,next,err,doc);
                });
            }
        }
    ];
};