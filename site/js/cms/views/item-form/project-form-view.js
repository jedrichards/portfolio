define([
    "jquery",
    "backbone",
    "mustache",
    "cms/views/item-form/abstract-item-form-view",
    "model/tag-collection",
    "config",
    "notes"
    ],function ($,Backbone,Mustache,AbstractItemFormView,TagCollection,config,notes) {

    return AbstractItemFormView.extend({

        initialize: function (options) {
            AbstractItemFormView.prototype.initialize.call(this,options);
            this.initDateInputEl();
            this.initTagsSelectInputEl();
        },

        initDateInputEl: function () {
            var date = new Date(this.model.get("date"));
            if ( date ) {
                var dateInput = this.$el.find("input[name='date']");
                dateInput.val(date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear());
            }
        },

        initTagsSelectInputEl: function () {
            var self = this;
            var tagsSelectEl = this.$el.find("select[name='tags']");
            var tagCollection = new TagCollection();
            tagCollection.fetch({
                success: function () {
                    tagCollection.each(function (tag) {
                        var isSelected = false;
                        for ( var i=0; i<self.model.get("tags").length; i++ ) {
                            if ( tag.get("_id") === self.model.get("tags")[i]._id ) {
                                isSelected = true;
                                break;
                            }
                        }
                        var optionEl = $("<option>");
                        optionEl.attr("value",tag.get("_id"));
                        optionEl.attr("selected",isSelected);
                        optionEl.html(tag.get("name"));
                        tagsSelectEl.append(optionEl);
                    });
                }
            });
        },

        beforeSave: function () {
            var tagsSelectEl = this.$el.find("select[name='tags']")[0];
            var selectedOptions = tagsSelectEl.selectedOptions;
            var tags = [];
            for ( var i=0; i<selectedOptions.length; i++ ) {
                tags.push(selectedOptions[i].value);
            }
            this.model.set("tags",tags);
        }
    });
});