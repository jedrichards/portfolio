var restify = require("restify");
var api = require("../api");
var db = require("../../db/db");

/**
 * Routes related to the RESTful manipulation of the Session database object.
 */
module.exports = function (server) {

    "use strict";

    var Session = db.getSessionModel();

    return [
        {
            description: "Output an array of all session documents",
            route: "/sessions",
            method: "get",
            needsAuth: true,
            needsSession: true,
            handler: function (req,res,next) {
                Session.getSessions(function (err,doc) {
                    api.handleDatabaseResult(req,res,next,err,doc);
                });
            }
        }
    ];
};