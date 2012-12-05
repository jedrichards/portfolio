var restify = require("restify");
var api = require("../api");
var db = require("../../db/db");

/**
 * Routes related to the RESTful manipulation of the Tag database object.
 */
module.exports = function () {

    "use strict";

    var Tag = db.getTagModel();

    return [
        {
            description: "Output an array of all tag documents",
            route: "/tags",
            method: "get",
            needsAuth: false,
            needsSession: true,
            handler: function (req,res,next) {
                Tag.getTags(function (err,doc) {
                    api.handleDatabaseResult(req,res,next,err,doc);
                });
            }
        },
        {
            description: "Output a single tag document by tag id",
            route: "/tags/:id",
            method: "get",
            needsAuth: false,
            needsSession: true,
            handler: function (req,res,next) {
                Tag.getTag(req.params.id,function (err,doc) {
                    api.handleDatabaseResult(req,res,next,err,doc);
                });
            }
        },
        {
            description: "Output an array of all project documents that have a particular tag id",
            route: "/tags/:id/projects",
            method: "get",
            needsAuth: false,
            needsSession: true,
            handler: function (req,res,next) {
                Tag.getTagProjects(req.params.id,function (err,doc) {
                    api.handleDatabaseResult(req,res,next,err,doc);
                });
            }
        },
        {
            description: "Create a new tag document",
            route: "/tags",
            method: "post",
            needsAuth: true,
            needsSession: true,
            handler: function (req,res,next) {
                if ( req.body ) {
                    Tag.createTag(req.body,function (err,doc) {
                        if ( !err ) {
                            res.setHeader("Location","/tags/"+doc._id);
                        }
                        api.handleDatabaseResult(req,res,next,err,doc,201);
                    });
                } else {
                    api.handleBadParamsError(req,res,next);
                }
            }
        },
        {
            description: "Delete a tag document by tag id",
            route: "/tags/:id",
            method: "del",
            needsAuth: true,
            needsSession: true,
            handler: function (req,res,next) {
                Tag.deleteTag(req.params.id,function (err,doc) {
                    api.handleDatabaseResult(req,res,next,err,doc,200);
                });
            }
        },
        {
            description: "Update an existing tag document",
            route: "/tags/:id",
            method: "put",
            needsAuth: true,
            needsSession: true,
            handler: function (req,res,next) {
                if ( req.body ) {
                    Tag.updateTag(req.params.id,req.body,function (err,doc) {
                        api.handleDatabaseResult(req,res,next,err,doc);
                    });
                } else {
                    api.handleBadParamsError(req,res,next);
                }
            }
        }
    ];
};