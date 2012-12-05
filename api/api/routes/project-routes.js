var restify = require("restify");
var api = require("../api");
var db = require("../../db/db");

/**
 * Routes related to the RESTful manipulation of the Project database object.
 */
module.exports = function () {

    "use strict";

    var Project = db.getProjectModel();

    return [
        {
            description: "Output an array of all project documents",
            route: "/projects",
            method: "get",
            needsAuth: false,
            needsSession: true,
            handler: function (req,res,next) {
                Project.getProjects(function (err,doc) {
                    api.handleDatabaseResult(req,res,next,err,doc);
                });
            }
        },
        {
            description: "Create a new project document",
            route: "/projects",
            method: "post",
            needsAuth: true,
            needsSession: true,
            handler: function (req,res,next) {
                if ( req.body ) {
                    Project.createProject(req.body,function (err,doc) {
                        if ( !err && doc ) {
                            res.setHeader("Location","/projects/"+doc._id);
                        }
                        api.handleDatabaseResult(req,res,next,err,doc,201);
                    });
                } else {
                    api.handleBadParamsError(req,res,next);
                }
            }
        },
        {
            description: "Output a single project document by project id",
            route: "/projects/:id",
            method: "get",
            needsAuth: false,
            needsSession: true,
            handler: function (req,res,next) {
                Project.getProject(req.params.id,function (err,doc) {
                    api.handleDatabaseResult(req,res,next,err,doc);
                });
            }
        },
        {
            description: "Update some or all of a project document's fields (except its tag array)",
            route: "/projects/:id",
            method: "put",
            needsAuth: true,
            needsSession: true,
            handler: function (req,res,next) {
                if ( req.body ) {
                    Project.updateProject(req.params.id,req.body,function (err,doc) {
                        api.handleDatabaseResult(req,res,next,err,doc);
                    });
                } else {
                    api.handleBadParamsError(req,res,next);
                }
            }
        },
        {
            description: "Delete a project document by project id",
            route: "/projects/:id",
            method: "del",
            needsAuth: true,
            needsSession: true,
            handler: function (req,res,next) {
                Project.deleteProject(req.params.id,function (err,doc) {
                    api.handleDatabaseResult(req,res,next,err,doc,200);
                });
            }
        },
        {
            description: "Output an array of a project document's tags by project id",
            route: "/projects/:id/tags",
            method: "get",
            needsAuth: false,
            needsSession: true,
            handler: function (req,res,next) {
                Project.getProjectTags(req.params.id,function (err,doc) {
                    api.handleDatabaseResult(req,res,next,err,doc);
                });
            }
        },
        {
            description: "Replace a project document's array of tag ids with a new one by project id",
            route: "/projects/:id/tags",
            method: "put",
            needsAuth: true,
            handler: function (req,res,next) {
                if ( req.body ) {
                    Project.replaceProjectTags(req.params.id,req.body,function (err,doc) {
                        api.handleDatabaseResult(req,res,next,err,doc);
                    });
                } else {
                    api.handleBadParamsError(req,res,next);
                }
            }
        }
    ];
};