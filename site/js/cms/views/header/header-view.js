define([
    "backbone",
    "cms/views/header/auth-controls-view",
    "text!cms/templates/header/header.mustache"],
    function (Backbone,AuthControlsView,template) {

    return Backbone.View.extend({

        initialize: function () {
            this.render();
        },

        render: function () {

            this.$el.html(template);

            this.authControlsView = new AuthControlsView({el:this.$el.find("#auth-controls")});
        }
    });
});