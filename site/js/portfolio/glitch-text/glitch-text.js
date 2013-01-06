define(function (require) {

    var GlitchTextLetter = require("./glitch-text-letter");
    var MathUtils = require("utils/math-utils");
    var randomChars = "jldfsifnJSODNBD~±§1234567890!@£$%^&*()-=_+,./<>?";

    var GlitchText = function (el,duration,charDuration,numCharSteps,onComplete) {
        this.el = el;
        this.origText = el.innerHTML;
        this.duration = duration;
        this.charDuration = charDuration;
        this.numCharSteps = numCharSteps;
        this.textLength = this.origText.length;
        this.onComplete = onComplete;
        this.el.innerHTML = "";
    };

    GlitchText.prototype.start = function () {
        this.lettersArray = [];
        for ( var i=0; i<this.textLength; i++ ) {
            var letter = new GlitchTextLetter(randomChars,this.charDuration,this.numCharSteps,this.origText.charAt(i));
            this.lettersArray.push(letter);
        }
        this.startTime = Date.now();
        requestAnimationFrame(this.step.bind(this));
    };

    GlitchText.prototype.step = function (time) {
        var pos = MathUtils.easeOut(Date.now()-this.startTime,this.duration,3);
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
            if ( this.onComplete ) this.onComplete();
        }
    };

    return GlitchText;
});