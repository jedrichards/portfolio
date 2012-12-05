define([
    "jquery",
    "backbone",
    "base64",
    "notes",
    "config",
    "text!cms/templates/header/auth-controls.mustache"],
    function ($,Backbone,base64,notes,config,template) {

    return Backbone.View.extend({

        events: {
            "click #log-in-btn": "logIn",
            "click #log-out-btn": "logOut",
            "submit #log-in-btn": "logIn"
        },

        initialize: function () {
            this.render();
        },

        render: function () {

            var self = this;

            this.$el.html(template);

            this.$el.find("#auth-controls-logged-out").hide();
            this.$el.find("#auth-controls-logged-in").hide();

            var req = $.ajax({
                url: config.api.url+"/check-session",
                xhrFields: {
                    withCredentials: true
                }
            });

            req.done(function (data) {
                if ( data.valid ) {
                    self.setAuthUser(data.user);
                    self.toggleState(true);
                    Backbone.Notifications.trigger(notes.SHOW_MESSAGE,{title:"Welcome back, "+data.user+".",message:"You have been automatically logged in.",error:false});
                } else {
                    self.toggleState(false);
                }
            });
        },

        toggleState: function (isLoggedIn) {
            if ( isLoggedIn ) {
                this.$el.find("#auth-controls-logged-in").show();
                this.$el.find("#auth-controls-logged-out").hide();
            } else {
                this.$el.find("#auth-controls-logged-in").hide();
                this.$el.find("#auth-controls-logged-out").show();
            }
        },

        setAuthUser: function (authUser) {
            this.$el.find("#auth-controls-logged-in-user").text(authUser);
        },

        logIn: function (event) {

            event.preventDefault();

            var self = this;

            var username = this.$el.find("#auth-controls-logged-out input[type='text']").val();
            var password = this.$el.find("#auth-controls-logged-out input[type='password']").val();

            var token = username+":"+password;
            var tokenHash = base64.encode(token);
            var credentials = "Basic "+tokenHash;

            var req = $.ajax({
                url: config.api.url+"/login",
                headers: {
                    "Authorization":credentials
                },
                xhrFields: {withCredentials:true}
            });

            req.done(function () {
                self.toggleState(true);
                self.setAuthUser(username);
                Backbone.Notifications.trigger(notes.SHOW_MESSAGE,{title:"Weclome back, "+username+".",error:false,message:"You are now logged in."});
                Backbone.Notifications.trigger(notes.LOGGED_IN);
            });

            req.fail(function (xhr) {
                self.toggleState(false);
                Backbone.Notifications.trigger(notes.SHOW_MESSAGE,{title:"Log in failed.",error:true,message:"Check your username and password and try again"});
            });
        },

        logOut: function (event) {
            var self = this;
            var req = $.ajax({
                url: config.api.url+"/logout",
                xhrFields: {withCredentials:true}
            });
            req.complete(function (jqXHR,status) {
                self.toggleState(false);
                Backbone.Notifications.trigger(notes.NAVIGATE_TO_ROUTE_REQUEST,{route:""});
                if ( status === "success" ) {
                    Backbone.Notifications.trigger(notes.SHOW_MESSAGE,{title:"Log out success.",message:""});
                } else {
                    Backbone.Notifications.trigger(notes.SHOW_MESSAGE,{title:"Log out failed.",error:true,message:""});
                }
                Backbone.Notifications.trigger(notes.LOGGED_OUT);
            });
        }
    });
});