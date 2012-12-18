define(function () {

    function easeOut (t,d) {
        return 1-Math.pow(1-(t/d),3);
    }

    function easeIn (t,d){
        return Math.pow(t/d,3);
    }

    function randomInt (min,max) {
        return Math.floor(Math.random()*(max-min+1))+min;
    }

    function limit (value,min,max) {
        return Math.min(max,Math.max(min,value));
    }

    var GlitchTextLetter = function (randomChars,duration,numSteps,finalChar) {
        this.value = "";
        this.started = false;
        this.complete = false;
        this.randomChars = randomChars;
        this.duration = duration;
        this.numSteps = numSteps;
        this.finalChar = finalChar;
        this.charArray = [];

        for ( var i=0; i<this.numSteps; i++ ) {
            this.charArray[i] = i === this.numSteps-1 ? this.finalChar : this.finalChar === " " ? " " : this.randomChars.charAt(randomInt(0,this.randomChars.length));
        }
    };

    GlitchTextLetter.prototype.start = function () {
        if ( this.started ) {
            return;
        }
        this.started = true;
        this.value = this.finalChar;
        this.startTime = Date.now();
        requestAnimationFrame(this.step.bind(this));
    };

    GlitchTextLetter.prototype.step = function (time) {
        var progress = Date.now()-this.startTime;
        var pos = limit(easeOut(progress,this.duration),0,1);
        var index = Math.round((this.charArray.length-1)*pos);

        this.value = this.charArray[index];

        if ( progress < this.duration ) {
            requestAnimationFrame(this.step.bind(this));
        } else {
            this.complete = true;
            this.value = this.finalChar;
        }
    };

    GlitchTextLetter.prototype.getCurrChar = function () {
        return this.value;
    };

    GlitchTextLetter.prototype.isComplete = function () {
        return this.complete;
    };

    return GlitchTextLetter;
});