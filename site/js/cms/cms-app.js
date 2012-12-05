define([
    "underscore",
    "backbone",
    "cms/views/main-app-view",
    "cms/routes/router",
    "notes",
    "model/project-collection",
    "model/tag-collection",
    "model/user-collection",
    "model/session-collection"],
    function (_,Backbone,MainAppView,Router,notes,ProjectCollection,TagCollection,UserCollection,SessionCollection) {

    var mainAppView;
    var router;
    var collections;

    /**
     * Main CMS app init function.
     */
    function init(appContainer) {

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
            "tags": new TagCollection(),
            "users": new UserCollection(),
            "sessions": new SessionCollection()
        };

        // Map routes to router events, and start listening to all route
        // changes:
        router = new Router({collections:collections});
        router.on("all",onRouteChanged,this);

        // Bind to relevant events dispatched by the global event bus:
        Backbone.Notifications.on(notes.NAVIGATE_TO_ROUTE_REQUEST,navigateToRouteRequest,this);
        Backbone.Notifications.on(notes.REFRESH_CURRENT_ROUTE_REQUEST,refreshCurrentRouteRequest,this);
        Backbone.Notifications.on(notes.CREATE_NEW_FOR_CURRENT_ROUTE_REQUEST,createNewCurrentRouteRequest,this);
        Backbone.Notifications.on(notes.LOGGED_OUT,loggedOut,this);

        // Instantiate and render the main application view:
        mainAppView = new MainAppView({el:appContainer,collections:collections});
        mainAppView.render();

        // Kick off Backbone HTML5 history API support:
        Backbone.history.start({root:"cms",pushState:true});
    }

    /**
     * Respond to a NAVIGATE_TO_ROUTE_REQUEST app event. Use the router to
     * change the URL and trigger a route changed changed event.
     */
    function navigateToRouteRequest (event) {
        router.navigate(event.route,{trigger:true});
    }

    /**
     * Respond to a REFRESH_CURRENT_ROUTE_REQUEST app event. Re-fetch the
     * collection for the currently active collection.
     */
    function refreshCurrentRouteRequest (event) {
        var collection = collections[Backbone.history.fragment.split("/")[0]];
        collection.fetch({
            success: function (collection,xhr,options) {
                Backbone.Notifications.trigger(notes.CURRENT_ROUTE_REFRESH_COMPLETE);
            },
            error: function (collection,xhr,options) {
                var serverError = JSON.parse(xhr.responseText);
                Backbone.Notifications.trigger(notes.SHOW_MESSAGE,{title:"Error "+xhr.status+" "+serverError.code,error:true,message:serverError.message});
                Backbone.Notifications.trigger(notes.CURRENT_ROUTE_REFRESH_COMPLETE);
            }
        });
    }

    /**
     * Respond to a CREATE_NEW_FOR_CURRENT_ROUTE_REQUEST app event. Determine the
     * currently active collection and navigate to the /collection/new route.
     */
    function createNewCurrentRouteRequest (event) {
        var collection = collections[Backbone.history.fragment.split("/")[0]];
        Backbone.Notifications.trigger(notes.NAVIGATE_TO_ROUTE_REQUEST,{route:collection.name+"/new"});
    }

    /**
     * Responds to all route change events from the router. If the new route is
     * the root of the app then redirect to "/projects", otherwise dispatch a
     * global event informing the rest of the app about the route change. Routes
     * are auto generated in router.js, but are in the general format:
     *
     * /collection     - Displays a list of collection models
     * /collection/new - Displays a form for creating a new collection model
     * /collection/id  - Displays a form for editing an existing collection model
     */
    function onRouteChanged (event,id) {
        var route = event.split(":")[1];
        if ( route === "root" ) {
            router.navigate("projects",{trigger:true});
            return;
        }
        var action = id ? null : Backbone.history.fragment.split("/")[1];
        Backbone.Notifications.trigger(notes.ROUTE_CHANGED,{route:route,action:action,id:id});
    }

    function loggedOut (event) {
        collections.users.reset();
        collections.sessions.reset();
    }

    // Expose a public API:
    return {
        init: init
    };
});
