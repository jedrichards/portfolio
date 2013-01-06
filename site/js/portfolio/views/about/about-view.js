define(function (require) {

    var Backbone = require("backbone");
    var Mustache = require("mustache");
    var DataFormatting = require("utils/data-formatting");

    var template = require("text!portfolio/templates/about/about.mustache");

    return Backbone.View.extend({

        initialize: function (options) {
            this.model.on("change",this.render,this);
        },

        render: function () {

            this.$el.html(template);

            var data = this.model.toJSON();

            if ( data.twitter ) {
                data.twitter.text = DataFormatting.linkifyTweetText(data.twitter.text);
                data.twitter.dateText = DataFormatting.formatMSTimestamp(data.twitter.date);
                this.appendSocialItem(Mustache.render(require("text!portfolio/templates/about/twitter.mustache"),data.twitter));
            }

            if ( data.github ) {
                data.github.dateText = DataFormatting.formatMSTimestamp(data.github.date);
                data.github.sha = data.github.sha.substring(0,6);
                data.github.repoUrl = "https://github.com/"+data.github.repo;
                this.appendSocialItem(Mustache.render(require("text!portfolio/templates/about/github.mustache"),data.github));
            }

            if ( data.foursquare ) {
                data.foursquare.dateText = DataFormatting.formatMSTimestamp(data.foursquare.date);
                this.appendSocialItem(Mustache.render(require("text!portfolio/templates/about/foursquare.mustache"),data.foursquare));
            }

            if ( data.lastfm ) {
                data.lastfm.dateText = DataFormatting.formatMSTimestamp(data.lastfm.date);
                this.appendSocialItem(Mustache.render(require("text!portfolio/templates/about/lastfm.mustache"),data.lastfm));
            }
        },

        appendSocialItem: function (html) {
            this.$el.find("ul").append("<li>"+html+"</li>");
        },

        fadeInList: function () {
            this.$el.find("li").fadeTo(0,0).each(function (index) {
                $(this).delay(index*100).fadeTo(250,1);
            });
        }
    });
});