define([
    "jquery",
    "backbone",
    "mustache",
    "config",
    "notes"
    ],function ($,Backbone,Mustache,config,notes) {

    return Backbone.View.extend({

        events: {
            "change": "onChange",
            "click .form-actions button[type='submit']": "onSubmit",
            "click .form-actions button[type='button'].btn-danger": "onDelete",
            "click .form-actions button[type='button']:not(.btn-danger)": "onCancel"
        },

        initialize: function (options) {
            this.template = options.template;
            this.formFieldsPartial = options.formFieldsPartial;
            this.render();
            if ( this.model.get("_id") ) {
                this.$el.find(".form-actions button[type='submit']").attr("disabled",true);
            } else {
                this.$el.find(".form-actions button[type='button'].btn-danger").attr("disabled",true);
            }
        },

        render: function () {
            var templateData = this.model.toJSON();
            this.$el.html(Mustache.render(this.template,templateData,this.formFieldsPartial));
        },

        beforeSave: function () {
        },

        save: function () {
            var self = this;
            if ( !this.model.get("_id") ) {
                this.collection.add(this.model);
            }
            this.model.save(null,{
                success: function (model,res,options) {
                    Backbone.Notifications.trigger(notes.SHOW_MESSAGE,{title:"Success.",message:"Changes saved."});
                    Backbone.Notifications.trigger(notes.NAVIGATE_TO_ROUTE_REQUEST,{route:self.collection.name+"/"+model.get("_id")});
                },
                error: function (model,res,options) {
                    var serverError = JSON.parse(res.responseText);
                    Backbone.Notifications.trigger(notes.SHOW_MESSAGE,{title:"Error "+res.status+" "+serverError.code,error:true,message:serverError.message});
                    self.collection.remove(self.model);
                }
            });
        },

        onChange: function (event) {
            this.$el.find(".form-actions button[type='submit']").attr("disabled",false);
            this.model.set(event.target.name,event.target.value);
        },

        onSubmit: function (event) {
            event.preventDefault();
            this.beforeSave();
            this.save();
        },

        onDelete: function (event) {
            var self = this;
            this.model.destroy({
                success: function (model,res,options) {
                    Backbone.Notifications.trigger(notes.SHOW_MESSAGE,{title:"Success.",message:"Item deleted."});
                    Backbone.Notifications.trigger(notes.NAVIGATE_TO_ROUTE_REQUEST,{route:self.collection.name});
                },
                error: function (model,res,options) {
                    var serverError = JSON.parse(res.responseText);
                    Backbone.Notifications.trigger(notes.SHOW_MESSAGE,{title:"Error "+res.status+" "+serverError.code,error:true,message:serverError.message});
                    self.collection.add(self.model);
                }
            });
        },

        onCancel: function (event) {
            Backbone.Notifications.trigger(notes.NAVIGATE_TO_ROUTE_REQUEST,{route:this.collection.name});
        },

        onDestroy: function () {
        }
    });
});