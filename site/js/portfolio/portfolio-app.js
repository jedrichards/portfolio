define([
    "underscore",
    "backbone",
    "portfolio/routes/router",
    "model/project-collection",
    "model/tag-collection",
    "portfolio/views/main-view"],
    function (_,Backbone,Router,ProjectCollection,TagCollection,MainView) {

    var mainView;
    var router;
    var collections;

    /**
     * Main CMS app init function.
     */
    function init(containerEl) {

        // Enable CORS for Backbone model and collection syncing:
        var sync = Backbone.sync;
        Backbone.sync = function(method,model,options) {
            options = options || {};
            options.crossDomain = true;
            options.xhrFields = {withCredentials:true};
            sync.apply(this,arguments);
        };

        // Add a destroy() method to all views to faciliate GC and management of
        // short lived views:
        Backbone.View.prototype.destroy = function() {
            this.remove();
            this.unbind();
            if ( this.onDestroy ) {
                this.onDestroy();
            }
        };

        // Create a global event bus:
        Backbone.Notifications = {};
        _.extend(Backbone.Notifications,Backbone.Events);

        // Instantiate the main collections this CMS will operate on:
        collections = {
            "projects": new ProjectCollection(),
            "tags": new TagCollection()
        };

        // Map routes to router events, and start listening to all route
        // changes:
        router = new Router({collections:collections});
        router.on("all",onRouteChanged,this);

        // Bind to relevant events dispatched by the global event bus:
        Backbone.Notifications.on("navigate",onNavigateRequest,this);

        // Instantiate the main application view:
        mainView = new MainView({el:containerEl,collections:collections});

        // Kick off Backbone HTML5 history API support:
        Backbone.history.start({pushState:true});
    }

    function onNavigateRequest(route) {
        router.navigate(route,{trigger:true});
    }

    function onRouteChanged (event,id) {
        console.log(event,id);
    }

    // Expose a public API:
    return {
        init: init
    };
});
