var restify = require("restify");
var db = require("../../db/db");
var api = require("../api");

module.exports = function () {

    var User = db.getUserModel();

    return function (req,res,next) {
        if ( !req.session ) {
            api.handleAPIError(req,res,next,new Error("Auth middleware didn't find a session object in the request."));
        } else {
            if ( req.session.isAuth ) {
                next();
            } else {
                api.handleUnauthorisedAccessError(req,res,next);
            }
        }
    };
};