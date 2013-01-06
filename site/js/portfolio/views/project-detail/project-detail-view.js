define(function (require) {

    var Backbone = require("backbone");
    var Mustache = require("mustache");

    var template = require("text!portfolio/templates/project-detail/project-detail.mustache");

    return Backbone.View.extend({

        initialize: function (options) {
            this.render();
        },

        render: function () {
            this.$el.html(Mustache.render(template,this.model.toJSON()));
        }
    });
});