define(["backbone","model/session","config"],function (Backbone,Session,config) {
    return Backbone.Collection.extend({
        model: Session,
        url: config.api.url+"/sessions",
        name: "sessions"
    });
});