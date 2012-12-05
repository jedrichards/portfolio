var mongoose = require("mongoose");
var config = require("../../config");
var bcrypt = require("bcrypt");
var uuid = require("node-uuid");

var schema = new mongoose.Schema({
    sid: {type:String,required:true,index:{unique:true}},
    isAuth: {type:Boolean,default:false},
    authUser: String,
    fingerPrint: String,
    refreshedAt: {type:Date,expires:config.api.sessionTTLSecs},
    ip: String
});

schema.method("refresh",function (cb) {
    this.refreshedAt = new Date();
    this.save(cb);
});

schema.method("isExpired",function () {
    return new Date().getTime()>this.refreshedAt.getTime()+(config.api.sessionTTLSecs*1000);
});

schema.static("validate",function (sid,req,cb) {
    this.findOne({sid:sid},function (err,session) {
        if ( err ) {
            cb(err,null,1,"Database error accessing session. "+err.toString());
        } else if ( !session ) {
            cb(null,null,2,"Invalid session ID.");
        } else {
            bcrypt.compare(getFingerPrintString(req),session.fingerPrint,function (err,isFingerPrintValid) {
                if ( err ) {
                    cb(err,null,3,"Crypto error comparing fingerprint with hash.");
                } else {
                    if ( isFingerPrintValid ) {
                        if ( session.isExpired() ) {
                            cb(null,null,4,"Session valid but expired.");
                        } else {
                            cb(null,session,0,"Session valid.");
                        }
                    } else {
                        cb(null,null,5,"Fingerprint integrity check failed."); // Suggests cookie hijack?
                    }
                }
            });
        }
    });
});

schema.static("getSessions",function (cb) {
    this.find({},{fingerPrint:0,password:0},cb);
});

schema.static("createSession",function (req,cb) {
    var self = this;
    getFingerPrintHash(req,function (err,hash) {
        var session = {
            sid: uuid.v4(),
            fingerPrint: hash,
            refreshedAt: new Date(),
            ip: getClientIP(req)
        };
        self.create(session,cb);
    });
});

schema.static("purge",function (cb) {
    this.remove({},cb);
});

function getFingerPrintHash (req,cb) {
    var fingerPrintString = getFingerPrintString(req);
    bcrypt.genSalt(10,function (err,salt) {
        if ( err ) {
            cb(err);
        } else {
            bcrypt.hash(getFingerPrintString(req),salt,function (err,hash) {
                if ( err ) {
                    cb(err);
                } else {
                    cb(null,hash);
                }
            });
        }
    });
}

function getFingerPrintString (req) {
    return getClientIP(req)+req.header("user-agent");
}

function getClientIP (req) {
    var ip;
    var forwardedIPs = req.header("x-forwarded-for");
    if ( forwardedIPs ) {
        var forwardedIps = forwardedIPs.split(",");
        ip = forwardedIps[0];
    }
    if ( !ip ) {
        ip = req.connection.remoteAddress;
    }
    return ip;
}

module.exports = schema;