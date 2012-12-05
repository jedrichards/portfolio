var Cookies = require("cookies");
var db = require("../../db/db");
var config = require("../../config");
var api = require("../api");

/**
 * Session middleware. Checks for the presence of a session id cookie in the
 * request. If not present it creates a new session in the database and applies
 * a new session id cookie. If a session id cookie is already present the
 * middleware attempts to validate it against known active sessions in the
 * database. If valid the session is refreshed and saved, if invalid a new
 * session is created.
 */
module.exports = function () {

    var Session = db.getSessionModel();

    return function (req,res,next) {
        var sid = req.getCookie("sid");
        if ( sid ) {
            Session.validate(sid,req,function (err,session,code,message) {
                switch ( code ) {
                    case 0:
                        req.session = session;
                        session.refresh(function (err) {
                            if ( err ) {
                                api.handleAPIError(req,res,next,err);
                            } else {
                                next();
                            }
                        });
                        break;
                    case 1:
                        api.handleAPIError(req,res,next,new Error(message));
                        break;
                    case 2:
                    case 3:
                    case 4:
                        createSession(req,res,next);
                        break;
                    case 5:
                        api.handleWarning(message);
                        createSession(req,res,next);
                        break;
                }
            });
        } else {
            createSession(req,res,next);
        }
    };

    /**
     * Creates a new session. This is achieved by first creating the session in
     * the database and then applying the new session id cookie.
     * @param  {Object}   req     Request object.
     * @param  {Object}   res     Response object.
     * @param  {Function} next    Middleware next function.
     */
    function createSession(req,res,next) {
        Session.createSession(req,function (err,session) {
            if ( err ) {
                api.handleAPIError(req,res,next,err);
            } else {
                req.setCookie("sid",session.sid,true);
                req.session = session;
                next();
            }
        });
    }
};