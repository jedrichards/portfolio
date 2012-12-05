define([
    "backbone",
    "cms/views/header/header-view",
    "cms/views/user-message/user-messages-container-view",
    "cms/views/nav/nav-view",
    "cms/views/item-list/item-lists-container-view",
    "cms/views/item-form/item-form-container-view",
    "notes",
    "text!cms/templates/main-app.mustache"],
    function (Backbone,HeaderView,UserMessagesContainerView,NavView,ItemListsContainerView,ItemFormContainerView,notes,template) {

    return Backbone.View.extend({

        initialize: function (options) {
            this.collections = options.collections;
        },

        render: function () {
            this.$el.html(template);
            this.headerView = new HeaderView({el:this.$el.find("#cms-header")});
            this.userMessagesContainerView = new UserMessagesContainerView({el:this.$el.find("#cms-user-messages-container")});
            this.navView = new NavView({el:this.$el.find("#cms-nav"),collections:this.collections});
            this.itemListsContainerView = new ItemListsContainerView({el:this.$el.find("#cms-item-lists-container"),collections:this.collections});
            this.itemFormContainerView = new ItemFormContainerView({el:this.$el.find("#cms-item-form-container"),collections:this.collections});
        }
    });
});