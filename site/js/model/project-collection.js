define(["backbone","model/project","config"],function (Backbone,Project,config) {
    return Backbone.Collection.extend({
        model: Project,
        url: config.api.url+"/projects",
        name: "projects"
    });
});