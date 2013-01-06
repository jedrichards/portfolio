define(["backbone","config"],function (Backbone,config) {
    return Backbone.Model.extend({
        idAttribute: "_id",
        urlRoot: config.api.url+"/projects",
        defaults: {
            name: "Project name",
            date: new Date().toString(),
            description: "Project description.",
            image: "",
            link: "",
            tags: []
        }
    });
});