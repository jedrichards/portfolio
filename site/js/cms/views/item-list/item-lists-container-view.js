define([
    "backbone",
    "mustache",
    "cms/views/item-list/item-list-view",
    "cms/views/item-list/item-list-controls-view",
    "notes",
    "text!cms/templates/item-list/project-item-list.mustache",
    "text!cms/templates/item-list/tag-item-list.mustache",
    "text!cms/templates/item-list/session-item-list.mustache",
    "text!cms/templates/item-list/user-item-list.mustache"],
    function (Backbone,Mustache,ItemListView,ItemListControlsView,notes,projectItemListTemplate,tagItemListTemplate,sessionItemListTemplate,userItemListTemplate) {

    return Backbone.View.extend({

        initialize: function (options) {
            Backbone.Notifications.on(notes.ROUTE_CHANGED,this.onRouteChanged,this);
            this.collections = options.collections;
            this.templates = {
                "projects": projectItemListTemplate,
                "sessions": sessionItemListTemplate,
                "tags": tagItemListTemplate,
                "users": userItemListTemplate
            };
            this.render();
        },

        render: function () {
            this.itemListControls = new ItemListControlsView();
            this.$el.append(this.itemListControls.el);
        },

        onRouteChanged: function (event) {
            if ( this.itemListView ) {
                this.itemListView.destroy();
            }
            if ( event.action || event.id ) {
                this.itemListControls.$el.hide();
            } else {
                this.itemListControls.$el.show();
                var collection = this.collections[event.route];
                var template = this.templates[event.route];
                this.itemListView = new ItemListView({collection:collection,template:template});
                this.$el.append(this.itemListView.el);
            }
        }
    });
});