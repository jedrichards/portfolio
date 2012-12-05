define(["backbone"],function (Backbone) {
    return Backbone.Model.extend({
        idAttribute: "_id",
        defaults: {
            name: "Tag name"
        }
    });
});