define(function (require) {

    var $ = require("jquery");
    var _ = require("underscore");
    var Backbone = require("backbone");
    var AppContainerView = require("portfolio/views/app-container-view");
    var FeatureDetection = require("utils/feature-detection");
    var Polyfills = require("utils/polyfills");
    var ProjectCollection = require("model/project-collection");
    var TagCollection = require("model/tag-collection");
    var SocialModel = require("model/social");

    var appContainerView;
    var router;

    var appContainerEl = $("#app-container");
    var isFirstRouteChange = true;
    var socialModel = new SocialModel();
    var tagCollection = new TagCollection();
    var projectCollection = new ProjectCollection();

    function init() {

        if ( !FeatureDetection.hasXHR2() && !FeatureDetection.hasXDR() ) {
            // Browser isn't capable of CORS requests to our API so we're
            // stumped. Exit here :(
            return;
        }

        appContainerEl.removeClass("is-hidden-for-js");

        augmentBackbone();

        Backbone.Notifications.on("navigate",onNavigateRequest,this);

        appContainerView = new AppContainerView({
            el:appContainerEl,
            projectCollection: projectCollection,
            tagCollection: tagCollection,
            socialModel: socialModel
        });

        router = new Backbone.Router({routes:{
            "": "root",
            "projects/:id": "projects"
        }});

        router.on("all",onRouteChanged,this);
        Backbone.history.start({pushState:true});

        socialModel.fetch();
        projectCollection.fetch();
        tagCollection.fetch();
    }

    function onNavigateRequest (route) {
        router.navigate(route,{trigger:true});
    }

    function onRouteChanged (event,id) {
        var route = event.split(":")[1];
        if ( isFirstRouteChange ) {
            isFirstRouteChange = false;
            onFirstRouteEvent(route);
        }
        switch ( route ) {
            case "root":
                Backbone.Notifications.trigger("showRoot");
                break;
            case "projects":
                Backbone.Notifications.trigger("showProjectDetail",{id:id});
                break;
        }
    }

    function onFirstRouteEvent (route) {
        var doIntro = route === "root";
        if ( FeatureDetection.hasLocalStorage() && doIntro ) {
            var localStorage = window.localStorage;
            var key = "lastIntroTime";
            var value = localStorage.getItem(key);
            localStorage.setItem(key,Date.now());
            if ( value !== null ) {
                if ( (Date.now()-value)<15000 ) {
                    doIntro = false;
                }
            }
        }
        Backbone.Notifications.trigger(doIntro?"doIntro":"noIntro");
    }

    function augmentBackbone () {

        if ( FeatureDetection.hasXHR2() ) {
            Polyfills.backboneCORS(Backbone);
        } else if ( FeatureDetection.hasXDR() ) {
            Polyfills.jqueryXDomainRequest($);
        }

        Backbone.View.prototype.destroy = function () {
            this.remove();
            this.unbind();
            if ( this.onDestroy ) this.onDestroy();
        };
        Backbone.View.prototype.appendView = function (subView,parentView) {
            if ( !parentView ) {
                parentView = this.$el;
            }
            parentView.append(subView.$el);
            return subView;
        };

        Backbone.Notifications = {};
        _.extend(Backbone.Notifications,Backbone.Events);
    }

    return {
        init: init
    };
});
