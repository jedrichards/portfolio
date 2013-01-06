define(["backbone","config"],function (Backbone,config) {
    return Backbone.Model.extend({
        url: config.api.url+"/social"
    });
});