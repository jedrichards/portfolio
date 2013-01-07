/**
 * Main Restify API server setup and configuration.
 */

var config = require("../config");
var restify = require("restify");
var EventEmitter = require("events").EventEmitter;

module.exports = function () {

    "use strict";

    var emitter = new EventEmitter();
    var server;

    /**
     * Instantiate a Restify server, apply middleware and start listening.
     */
    function start () {

        // Start Restify 1.4 custom CORS headers hack. These headers allow
        // server cookies and HTTP basic authentication to work cross domain. By
        // default Restify 1.4 clobbers custom headers during res.send(). Also
        // mirror back the request's origin as the Access-Control-Allow-Origin
        // header value only if it's in our allowed list.
        var ServerResponse = require("http").ServerResponse;
        var writeHead = ServerResponse.prototype.writeHead;
        ServerResponse.prototype.writeHead = function () {
            this.setHeader("Access-Control-Allow-Headers",this.getHeader("Access-Control-Allow-Headers")+", Authorization");
            this.setHeader("Access-Control-Allow-Credentials","true");
            if ( config.api.accessControlAllowedOrigins.indexOf(this.req.headers.origin) !== -1 ) {
                this.setHeader("Access-Control-Allow-Origin",this.req.headers.origin);
            }
            writeHead.apply(this,arguments);
        };

        server = restify.createServer({
            name: config.api.name,
            version: config.api.version
        });

        server.use(restify.queryParser());
        server.use(restify.bodyParser({mapParams:false}));
        server.use(restify.authorizationParser());
        server.use(require("./middleware/cookies")());

        server.on("uncaughtException",function (req,res,route,err) {
            handleAPIError(req,res,function(){},err);
        });

        server.on("after",function (req,res,route) {
            if ( req.url !== "/ping") {
                var auth = req.session?(req.session.isAuth?" | +auth("+req.session.authUser+")":" | -auth"):"";
                emit("access",req.connection.remoteAddress+" | "+req.method+" | "+req.headers.host+req.url+" | "+res.statusCode+" | "+req.headers["user-agent"]+auth);
            }
        });

        server.listen(config.api.port,function () {
            serverStarted();
        });
    }

    /**
     * Setup all routes.
     */
    function serverStarted () {
        setupRoutes(require("./routes/project-routes")());
        setupRoutes(require("./routes/tag-routes")());
        setupRoutes(require("./routes/user-routes")());
        setupRoutes(require("./routes/auth-routes")());
        setupRoutes(require("./routes/misc-routes")());
        setupRoutes(require("./routes/session-routes")());
        emit("ready");
    }

    /**
     * Setup an array of routes. Apply route specific middleware based on the
     * declarative route configurations in the route files.
     */
    function setupRoutes(routes) {
        routes.forEach(function (route) {
            var middleware = [route.handler];
            if ( route.needsAuth ) {
                middleware.unshift(require("./middleware/auth")());
            }
            if ( route.needsSession ) {
                middleware.unshift(require("./middleware/session")());
            }
            server[route.method](route.route,middleware);
            emit("info","route: "+route.method.toUpperCase()+" "+route.route+(route.needsAuth?" +auth":""));
        });
    }

    /**
     * Handle a result from the database. If an error has been passed through or
     * the database result is missing then raise an appropriate error, otherwise
     * output the response.
     */
    function handleDatabaseResult (req,res,next,err,doc,code) {
        if ( err ) {
            handleAPIError(req,res,next,err);
        } else if ( !doc ) {
            handleNoResourceError(req,res,next);
        } else {
            sendResponse(req,res,next,doc,code);
        }
    }

    /**
     * Something has gone wrong an on the serverside so we should return a 500
     * Internal Server Error.
     */
    function handleAPIError (req,res,next,err) {
        emit("error",err);
        next(new restify.InternalError("An internal error occured."));
    }

    /**
     * The client's query has returned no results so we should return a 404 Not
     * Found.
     */
    function handleNoResourceError (req,res,next) {
        next(new restify.ResourceNotFoundError("No resource found for "+req.url+"."));
    }

    /**
     * The client has supplied missing or malformed parameters so we should
     * return a 409 Conflict.
     */
    function handleBadParamsError (req,res,next) {
        next(new restify.MissingParameterError("Bad or missing parameters."));
    }

    /**
     * The client has attempted to authenticate but the supplied credentials are
     * malformed or missing so return a 401 Not Authorised.
     */
    function handleMissingCredsError (req,res,next) {
        next(new restify.InvalidCredentialsError("HTTP basic auth credentials are missing."));
    }

    /**
     * The client has attempted to authenticate but the supplied credentials are
     * invalid so return a 401 Not Authorised.
     */
    function handleBadCredsError (req,res,next) {
        next(new restify.InvalidCredentialsError("HTTP basic auth credentials are invalid."));
    }

    /**
     * The client has attempted to access a route that requires authentication
     * but their session is not authenticated, so return 403 Forbidden.
     */
    function handleUnauthorisedAccessError (req,res,next) {
        next(new restify.NotAuthorizedError("Not authorised to access this resource."));
    }

    /**
     * Send a response to the client. If doc is equal to 1 then the response is
     * returned with just a status code and no body.
     */
    function sendResponse(req,res,next,doc,code) {
        if ( code ) {
            if ( doc === 1 ) {
                res.send(code);
            } else {
                res.send(code,doc);
            }
        } else {
            res.send(doc);
        }
        next();
    }

    /**
     * Emit an alert event from the API.
     */
    function handleWarning (message) {
        emit("alert",message);
    }

    /**
     * Emit an event from the API.
     */
    function emit (name,message) {
        emitter.emit(name,message);
    }

    // Expose a public API:

    return {
        start: start,
        on: emitter.on.bind(emitter),
        handleDatabaseResult: handleDatabaseResult,
        handleAPIError: handleAPIError,
        handleNoResourceError: handleNoResourceError,
        handleBadParamsError: handleBadParamsError,
        handleMissingCredsError: handleMissingCredsError,
        handleBadCredsError: handleBadCredsError,
        handleUnauthorisedAccessError: handleUnauthorisedAccessError,
        handleWarning: handleWarning,
        sendResponse: sendResponse
    };
}();