define(["backbone","model/tag","config"],function (Backbone,Tag,config) {
    return Backbone.Collection.extend({
        model: Tag,
        url: config.api.url+"/tags",
        name: "tags"
    });
});