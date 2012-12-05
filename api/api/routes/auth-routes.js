var restify = require("restify");
var api = require("../api");
var db = require("../../db/db");

/**
 * Routes related to session authorisation.
 *
 * The "login" route will attempt to authorise the user's session based on the
 * username and password combination supplied in the HTTP Basic Authorisation
 * header.
 *
 * The "logout" route will de-authorise the user's session.
 */
module.exports = function () {

    "use strict";

    var User = db.getUserModel();

    return [
        {
            description: "Verify the username/password combination in the HTTP basic auth headers and authorise/de-authorise the session.",
            route: "/login",
            method: "get",
            needsAuth: false,
            needsSession: true,
            handler: function (req,res,next) {
                if ( !req.session ) {
                    api.handleAPIError(req,res,next,new Error("Login route middleware didn't find a session object in the request."));
                } else {
                    if ( !req.authorization || !req.authorization.basic ) {
                        api.handleMissingCredsError(req,res,next);
                    } else {
                        var username = req.authorization.basic.username;
                        var password = req.authorization.basic.password;
                        User.authenticate(username,password,function (err,isAuth) {
                            if ( err ) {
                                api.handleAPIError(req,res,next,new Error("Authentication error. "+err.toString()));
                            } else {
                                authSession(req.session,isAuth,username,function (err,session) {
                                    if ( err ) {
                                        api.handleAPIError(req,res,next,new Error("Authentication error. "+err.toString()));
                                    } else {
                                        if ( isAuth ) {
                                            api.sendResponse(req,res,next,1,200);
                                        } else {
                                            api.handleBadCredsError(req,res,next);
                                        }
                                    }
                                });
                            }
                        });
                    }
                }
            }
        },
        {
            description: "De-authorise a session",
            route: "/logout",
            method: "get",
            needsAuth: false,
            needsSession: true,
            handler: function (req,res,next) {
                if ( !req.session ) {
                    api.sendResponse(req,res,next,1,200);
                } else {
                    authSession(req.session,false,null,function (err) {
                        if ( err ) {
                            api.handleAPIError(req,res,next,new Error("Authentication error. "+err.toString()));
                        } else {
                            api.sendResponse(req,res,next,1,200);
                        }
                    });
                }
            }
        },
        {
            description: "Check to see if the session is valid",
            route: "/check-session",
            method: "get",
            needsAuth: false,
            needsSession: true,
            handler: function (req,res,next) {
                if ( !req.session || !req.session.isAuth ) {
                    api.sendResponse(req,res,next,{valid:false});
                } else {
                    api.sendResponse(req,res,next,{valid:true,user:req.session.authUser});
                }
            }
        }
    ];
    //function sendResponse(req,res,next,doc,code) {
    /**
     * Takes a database session document, sets the isAuth and authUser values
     * based on the function arguments and attempts to save it.
     *
     * @param  {Object}   session  Mongoose Session model document.
     * @param  {Boolean}  isAuth   Whether the session is authorised.
     * @param  {String}   authUser The username of the authorised user.
     * @param  {Function} cb       Callback for the save operation.
     */
    function authSession(session,isAuth,authUser,cb) {
        session.isAuth = isAuth;
        session.authUser = isAuth ? authUser : "";
        session.save(cb);
    }
};