define([
    "jquery",
    "backbone",
    "mustache",
    "cms/views/item-form/abstract-item-form-view",
    "config",
    "notes"
    ],function ($,Backbone,Mustache,AbstractItemFormView,config,notes) {

    return AbstractItemFormView.extend({

        render: function () {
            AbstractItemFormView.prototype.render.call(this);
            this.$el.find("button[type='submit']").remove();
            this.$el.find("button.btn-danger").remove();
        }
    });
});