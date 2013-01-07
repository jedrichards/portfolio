define(function (require) {

    var Backbone = require("backbone");
    var ProjectCollection = require("model/project-collection");
    var SocialModel = require("model/social");
    var HeaderView = require("./header/header-view");
    var LinksView = require("./links/links-view");
    var ProjectsView = require("./projects/projects-view");
    var ProjectDetailContainerView = require("./project-detail/project-detail-container-view");
    var AboutView = require("./about/about-view");
    var LogoView = require("./logo/logo-view");

    return Backbone.View.extend({

        events: {
            "click .logo a": "onLogoClick"
        },

        initialize: function () {
            Backbone.Notifications.on("doIntro",this.doIntro,this);
            Backbone.Notifications.on("noIntro",this.noIntro,this);
            Backbone.Notifications.on("introComplete",this.introComplete,this);
            Backbone.Notifications.on("showRoot",this.showRoot,this);
            Backbone.Notifications.on("showProjectDetail",this.showProjectDetail,this);
            this.render();
        },

        render: function () {
            this.logoView = new LogoView({el:this.$el.find(".logo")});
            this.headerView = new HeaderView({el:this.$el.find(".header")});
            this.linksView = new LinksView({el:this.$el.find(".links")});
            this.subViewsContainer = this.$el.append("<div>").children().last();
            this.subViewsContainer.fadeTo(0,0);
            this.projectsView = this.appendView(new ProjectsView({
                projectCollection:this.options.projectCollection,
                tagCollection:this.options.tagCollection,
                className: "content-section projects"
            }),this.subViewsContainer);
            this.projectDetailContainerView = this.appendView(new ProjectDetailContainerView({
                collection:this.options.projectCollection,
                className: "content-section project-detail"
            }),this.subViewsContainer);
            this.aboutView = this.appendView(new AboutView({
                model: this.options.socialModel,
                className: "content-section about"
            }),this.subViewsContainer);
        },

        doIntro: function () {
            this.logoView.doIntro();
            this.headerView.doIntro();
        },

        noIntro: function () {
            this.linksView.showList();
            this.subViewsContainer.fadeTo(0,1);
        },

        introComplete: function (event) {
            this.subViewsContainer.fadeTo(2000,1);
            this.linksView.fadeInList(true);
            this.projectsView.fadeInLists();
            this.aboutView.fadeInList();
            this.logoView.hideIcon();
        },

        showRoot: function (event) {
            this.headerView.$el.show();
            this.linksView.$el.show();
            this.projectsView.$el.show();
            this.aboutView.$el.show();
            this.projectDetailContainerView.$el.hide();
            this.projectDetailContainerView.removeProject();
        },

        showProjectDetail: function (event) {
            this.headerView.$el.hide();
            this.linksView.$el.hide();
            this.projectsView.$el.hide();
            this.aboutView.$el.hide();
            this.projectDetailContainerView.$el.show();
            this.projectDetailContainerView.addProject(event.id);
        },

        onLogoClick: function (event) {
            event.preventDefault();
            Backbone.Notifications.trigger("navigate","");
        }
    });
});