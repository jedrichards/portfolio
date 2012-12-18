define([
    "backbone",
    "portfolio/views/header-view",
    "portfolio/views/links-view",
    "portfolio/views/projects-view"],
    function (Backbone,HeaderView,LinksView,ProjectsView) {

    return Backbone.View.extend({

        initialize: function (options) {
            this.headerView = new HeaderView({el:this.$el.find("#header")});
            this.linksView = new LinksView({el:this.$el.find("#links")});
            this.projectsView = new ProjectsView({el:this.$el.find("#projects"),collections:options.collections});
        }
    });
});