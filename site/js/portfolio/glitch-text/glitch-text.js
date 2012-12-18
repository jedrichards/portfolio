define(["portfolio/glitch-text/glitch-text-letter"],function (GlitchTextLetter) {

    var randomChars = "jldfsifnJSODNBD~±§1234567890!@£$%^&*()-=_+,./<>?";

    function easeOut (t,d) {
        return 1-Math.pow(1-(t/d),3);
    }

    function easeIn (t,d){
        return Math.pow(t/d,3);
    }

    var GlitchText = function (el,duration,charDuration,numCharSteps,onComplete) {

        this.el = el;
        this.origText = el.innerHTML;
        this.duration = duration;
        this.charDuration = charDuration;
        this.numCharSteps = numCharSteps;
        this.textLength = this.origText.length;
        this.onComplete = onComplete;

        var rAF = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        window.requestAnimationFrame = rAF;

        this.supported = requestAnimationFrame !== undefined;

        if ( this.supported ) {
            this.el.innerHTML = "";
        }
    }

    GlitchText.prototype.isSupported = function () {
        return this.supported;
    }

    GlitchText.prototype.start = function () {

        if ( !this.supported ) {
            return;
        }

        this.lettersArray = [];

        for ( var i=0; i<this.textLength; i++ ) {
            var letter = new GlitchTextLetter(randomChars,this.charDuration,this.numCharSteps,this.origText.charAt(i));
            this.lettersArray.push(letter);
        }

        this.startTime = Date.now();
        requestAnimationFrame(this.step.bind(this));
    }

    GlitchText.prototype.step = function (time) {

        var pos = easeOut(Date.now()-this.startTime,this.duration);
        var completeCount = 0;
        var index = Math.round(this.lettersArray.length*pos);
        var currString = "";

        for ( var i=0; i<this.textLength; i++ ) {
            if ( i < index ) {
                this.lettersArray[i].start();
            }
            currString += this.lettersArray[i].getCurrChar();
            if ( this.lettersArray[i].isComplete() ) {
                completeCount++;
            }
        }

        this.el.innerHTML = currString;

        if ( completeCount < this.textLength ) {
            requestAnimationFrame(this.step.bind(this));
        } else {
            if ( this.onComplete ) {
                this.onComplete();
            }
        }
    }

    return GlitchText;
});