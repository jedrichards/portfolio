define([
    "backbone",
    "mustache",
    "cms/views/user-message/user-message-view",
    "notes"
    ],function (Backbone,Mustache,UserMessageView,notes) {

    return Backbone.View.extend({

        initialize: function () {
            Backbone.Notifications.on(notes.SHOW_MESSAGE,this.onShowMessage,this);
        },

        onShowMessage: function (event) {
            var templateData = {
                class: event.error ? "alert-error" : "alert-info",
                title: event.title,
                message: event.message
            };
            var userMessage = new UserMessageView({templateData:templateData});
            this.$el.append(userMessage.el);
        }
    });
});