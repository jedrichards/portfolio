var db = require("../../db/db.js");
var restify = require("restify");

/**
 * Miscallaneous routes.
 *
 * The "ping" route simply outputs the plain text "ok" and ends the response.
 * Designed to be used as a lightweight route for checking that the API server
 * hasn't crashed and is responding to requests in a timely fashion.
 */
module.exports = function (server) {

    "use strict";

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
        }
    ];
};