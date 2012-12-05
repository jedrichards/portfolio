define(["backbone"],function (Backbone) {
    return Backbone.Model.extend({
        idAttribute: "_id",
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