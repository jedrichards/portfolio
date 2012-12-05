var restify = require("restify");
var api = require("../api");
var db = require("../../db/db");

/**
 * Routes related to the RESTful manipulation of the User database object.
 */
module.exports = function (server) {

    "use strict";

    var User = db.getUserModel();

    return [
        {
            description: "Output an array of all user documents",
            route: "/users",
            method: "get",
            needsAuth: true,
            needsSession: true,
            handler: function (req,res,next) {
                User.getUsers(function (err,doc) {
                    api.handleDatabaseResult(req,res,next,err,doc);
                });
            }
        }
    ];
};