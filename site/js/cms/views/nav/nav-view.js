define([
    "underscore",
    "backbone",
    "mustache",
    "notes",
    "text!cms/templates/nav/nav.mustache"
    ],function (_,Backbone,Mustache,notes,template) {

    return Backbone.View.extend({

        events: {
            "click ul li a": "navBtnClick"
        },

        initialize: function (options) {
            this.collections = options.collections;
            Backbone.Notifications.on(notes.ROUTE_CHANGED,this.routeChanged,this);
            this.render();
        },

        render: function () {
            var templateData = [];
            _.each(this.collections,function (collection) {
                templateData.push({
                    route: collection.name,
                    label: function () {
                        return this.route.charAt(0).toUpperCase()+this.route.slice(1);
                    }
                });
            });
            this.$el.html(Mustache.render(template,templateData));
        },

        navBtnClick: function (event) {
            Backbone.Notifications.trigger(notes.NAVIGATE_TO_ROUTE_REQUEST,{route:event.target.innerHTML.toLowerCase()});
        },

        routeChanged: function (event) {
            if ( this.currRoute ) {
                this.getNavItemByRoute(this.currRoute).removeClass("active");
            }
            this.currRoute = event.route;
            this.getNavItemByRoute(this.currRoute).addClass("active");
        },

        getNavItemByRoute: function (route) {
            return this.$el.find("li[data-route='"+this.currRoute+"']");
        }
    });
});