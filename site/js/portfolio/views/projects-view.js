define([
    "jquery",
    "backbone",
    "mustache",
    "portfolio/views/project-list-view",
    "portfolio/views/tag-filters-view",
    "text!portfolio/templates/projects.mustache"],
    function ($,Backbone,Mustache,ProjectListView,TagFiltersView,template) {

    return Backbone.View.extend({

        initialize: function (options) {
            this.$el.removeClass("initially-hidden");
            this.$el.hide();

            this.collections = options.collections;
            this.render();
            Backbone.Notifications.on("textIntroComplete",this.textIntroComplete,this);
        },

        textIntroComplete: function () {
            this.$el.fadeIn(2000);
        },

        render: function () {
            this.$el.html(template);
            this.tagFiltersView = new TagFiltersView({el:this.$el.find("#tag-filters"),collection:this.collections["tags"]});
            this.projectListView = new ProjectListView({el:this.$el.find("#project-list"),collection:this.collections["projects"]});
        }
    });
});