/**
 * Mongoose schema for the User collection.
 */

var mongoose = require("mongoose");
var sanitizer = require("sanitizer");
var bcrypt = require("bcrypt");
var config = require("../../config");
var Schema = mongoose.Schema;

var schema =  new Schema({
    username: {type:String,required:true,index:{unique:true}},
    password: {type:String,required:true}
});

/**
 * Pre save hook. Uses the bcrypt library to hash the plaintext password
 * before the document is saved to the DB.
 */
schema.pre("save",function (next) {
    var self = this;
    bcrypt.genSalt(10,function (err,salt) {
        if ( err ) {
            next(err);
        } else {
            bcrypt.hash(self.password,salt,function (err,hash) {
                if ( err ) {
                    next(err);
                } else {
                    self.password = hash;
                    next();
                }
            });
        }
    });
});

/**
 * Document instance method. Validates a plaintext password against the
 * document's stored password hash.
 */
schema.method("validatePassword", function (password,cb) {
    try {
        bcrypt.compare(password,this.password,cb);
    } catch ( err ) {
        cb(err);
    }
});

/**
 * Schema static method. Validates a username and plaintext password
 * combination.
 */
schema.static("authenticate", function (username,password,cb) {
    this.findOne({username:username},function (err,doc) {
        if ( err ) {
            cb(err);
        } else if ( !doc ) {
            cb(null,false);
        } else {
            doc.validatePassword(password,function (err,isValid) {
                if ( err ) {
                    cb(err);
                } else if ( !isValid ) {
                    cb(err,false);
                } else {
                    cb(null,true);
                }
            });
        }
    });
});

/**
 * Schema static method. Returns an array of all User documents in the DB.
 * The password hash field is omitted from the results.
 */
schema.static("getUsers",function (cb) {
    this.find({},{password:0},cb);
});

/**
 * Schema static method. Creates a new User document.
 */
schema.static("createUser",function (user,cb) {
    this.create(user,cb);
});

/**
 * Schema static method. Removes all existing User documents from the DB.
 */
schema.static("purge",function (cb) {
    this.remove({},cb);
});

/**
 * Adds a default admin User to the DB.
 */
schema.static("setupDefaultAdminUser",function (cb) {
    var self = this;
    this.find({username:config.api.adminUsername},function (err,user) {
        if ( err ) {
            cb(err);
        } else {
            if ( !user ) {
                cb(true);
            } else {
                if ( user.length === 0 ) {
                    self.createUser({username:config.api.adminUsername,password:config.api.adminPassword},cb);
                } else {
                    cb();
                }
            }
        }
    });
});

module.exports = schema;