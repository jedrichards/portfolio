define(function (require) {

    return {

        getDateTimeString: function (timestamp) {
            return this.getDateString(timestamp)+"T"+this.getTimeString(timestamp);
        },

        getDateString: function (timestamp) {
            var date;
            try {
                date = new Date(timestamp);
            } catch ( err ) {
                return "00/00/00";
            }
            return this.zeroPad(date.getDate())+"/"+this.zeroPad((date.getMonth()+1))+"/"+date.getFullYear().toString().substr(2,2);
        },

        getTimeString: function (timestamp) {
            var date;
            try {
                date = new Date(timestamp);
            } catch ( err ) {
                return "00:00";
            }
            return this.zeroPad(date.getHours())+":"+this.zeroPad(date.getMinutes());
        },

        zeroPad: function (value) {
            if ( parseInt(value,10) < 10 ) {
                return "0"+value
            } else {
                return value.toString(10);
            }
        },

        linkifyTweetText: function (text) {
            text = text.replace(/(https?:\/\/\S+)/gi,function (s) {
                var href = s;
                var hrefText = s.replace(new RegExp("https*:\/\/"),"");
                return "<a href=\""+href+"\">"+hrefText+"</a>";
            });
            text = text.replace(/(^|)@(\w+)/gi,function (s) {
                return "<a href=\"http://twitter.com/"+s+"\">"+s+"</a>";
            });
            text = text.replace(/(^|)#(\w+)/gi,function (s) {
                return "<a href=\"http://search.twitter.com/search?q="+s.replace(/#/,"%23")+"\">"+s+"</a>";
            });
            return text;
        }
    };
});