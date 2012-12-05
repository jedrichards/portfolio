define([
    "backbone",
    "mustache",
    "cms/views/item-form/project-form-view",
    "cms/views/item-form/tag-form-view",
    "cms/views/item-form/session-form-view",
    "cms/views/item-form/user-form-view",
    "notes",
    "text!cms/templates/forms/item-form.mustache",
    "text!cms/templates/forms/project-form-fields.mustache",
    "text!cms/templates/forms/tag-form-fields.mustache",
    "text!cms/templates/forms/session-form-fields.mustache",
    "text!cms/templates/forms/user-form-fields.mustache"
    ],function (Backbone,Mustache,ProjectFormView,TagFormView,SessionFormView,UserFormView,notes,formTemplate,projectFieldsTemplate,tagFieldsTemplate,sessionFieldsTemplate,userFieldsTemplate) {

    return Backbone.View.extend({

        initialize: function (options) {
            this.collections = options.collections;
            this.formViews = {
                "projects": ProjectFormView,
                "tags": TagFormView,
                "users": UserFormView,
                "sessions": SessionFormView
            };
            this.formFieldsPartials = {
                "projects": projectFieldsTemplate,
                "tags": tagFieldsTemplate,
                "users": userFieldsTemplate,
                "sessions": sessionFieldsTemplate
            };
            Backbone.Notifications.on(notes.ROUTE_CHANGED,this.onRouteChanged,this);
        },

        onRouteChanged: function (event) {
            if ( this.formView ) {
                this.formView.destroy();
            }
            if ( !event.action && !event.id ) {
                return;
            }
            var collection = this.collections[event.route];
            var self = this;
            if ( collection.length === 0 ) {
                collection.fetch({
                    error: function (collection,xhr,options) {
                        var serverError = JSON.parse(xhr.responseText);
                        Backbone.Notifications.trigger(notes.SHOW_MESSAGE,{title:"Error "+xhr.status+" "+serverError.code,error:true,message:serverError.message});
                    },
                    success: function () {
                        self.render(collection,event.id);
                    }
                });
            } else {
                this.render(collection,event.id);
            }
        },

        render: function (collection,id) {
            var model = id ? collection.get(id) : new collection.model();
            if ( model ) {
                var partial = {fields:this.formFieldsPartials[collection.name]};
                var view = this.formViews[collection.name];
                this.formView = new view({model:model,collection:collection,template:formTemplate,formFieldsPartial:partial});
                this.$el.append(this.formView.el);
            } else {
                Backbone.Notifications.trigger(notes.SHOW_MESSAGE,{title:"Error",error:true,message:"Item with id "+id+" not found."});
            }
        }
    });
});