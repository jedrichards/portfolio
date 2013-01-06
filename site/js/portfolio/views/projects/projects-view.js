define(function (require) {

    var Backbone = require("backbone");
    var Mustache = require("mustache");
    var ProjectListView = require("./project-list-view");
    var TagButtonsView = require("./tag-buttons-view");

    var template = require("text!portfolio/templates/projects/projects.mustache");

    return Backbone.View.extend({

        initialize: function (options) {
            this.projectCollection = options.projectCollection;
            this.tagCollection = options.tagCollection;
            this.render();
        },

        render: function () {
            this.$el.html(template);
            this.tagButtonsView = new TagButtonsView({
                el: this.$el.find(".tag-buttons"),
                collection: this.tagCollection
            });
            this.projectListView = new ProjectListView({
                el: this.$el.find(".project-list"),
                collection: this.projectCollection
            });
        },

        fadeInLists: function () {
            this.tagButtonsView.fadeInList();
            this.projectListView.fadeInList();
        }
    });
});