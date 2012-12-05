define(["backbone","model/user","config"],function (Backbone,User,config) {
    return Backbone.Collection.extend({
        model: User,
        url: config.api.url+"/users",
        name: "users"
    });
});