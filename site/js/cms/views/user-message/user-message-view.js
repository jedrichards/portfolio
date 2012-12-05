define([
    "backbone",
    "mustache",
    "notes",
    "text!cms/templates/user-message/user-message.mustache"
    ],function (Backbone,Mustache,notes,template) {

    return Backbone.View.extend({

        events: {
            "click .close": "onCloseClick"
        },

        initialize: function (options) {
            this.templateData = options.templateData;

            this.render();

            var self = this;

            this.timeoutID = window.setTimeout(function () {
                self.$el.find(".alert").slideUp(250,function () {
                    self.$el.find(".alert").alert("close");
                });
            },3000);
        },

        onCloseClick: function (event) {
            this.cancelTimeout();
        },

        cancelTimeout: function () {
            if ( this.timeoutID ) {
                window.clearTimeout(this.timeoutID);
                this.timeoutID = null;
            }
        },

        render: function () {
            this.$el.html(Mustache.render(template,this.templateData));
        }
    });
});