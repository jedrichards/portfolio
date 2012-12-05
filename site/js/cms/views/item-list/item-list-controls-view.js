define([
    "jquery",
    "backbone",
    "mustache",
    "notes",
    "text!cms/templates/item-list/item-list-controls.mustache"],
    function ($,Backbone,Mustache,notes,template) {

    return Backbone.View.extend({

        events: {
            "click #refresh-btn": "onRefreshBtnClicked",
            "click #create-btn": "onCreateNewBtnClicked"
        },

        initialize: function () {
            Backbone.Notifications.on(notes.CURRENT_ROUTE_REFRESH_COMPLETE,this.onCurrentRouteRefreshComplete,this);
            Backbone.Notifications.on(notes.ROUTE_CHANGED,this.onRouteChanged,this);
            this.render();
        },

        render: function () {
            this.$el.html(Mustache.render(template));
        },

        onRouteChanged: function (event) {
            if ( event.route === "sessions" || event.route === "users" ) {
                this.$el.find("#create-btn").attr("disabled",true);
            } else {
                this.$el.find("#create-btn").attr("disabled",false);
            }
        },

        onRefreshBtnClicked: function (event) {
            this.$el.find("#refresh-btn").attr("disabled",true);
            Backbone.Notifications.trigger(notes.REFRESH_CURRENT_ROUTE_REQUEST);
        },

        onCurrentRouteRefreshComplete: function (event) {
            this.$el.find("#refresh-btn").attr("disabled",false);
        },

        onCreateNewBtnClicked: function (event) {
            Backbone.Notifications.trigger(notes.CREATE_NEW_FOR_CURRENT_ROUTE_REQUEST);
        }
    });
});