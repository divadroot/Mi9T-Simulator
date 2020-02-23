var mi9t = $("#mi9t");
var camera = $("#camera");
var viewport = $("#viewport");
var cswitch = $("#switch");
var player = $("#player");

var loaded = 0;
var audioFiles = [
    "arix.ogg",
    "elo.ogg",
];

var startPos = 76;
var counter = localStorage.getItem("counter") || 0;

$.fn.animateRotate = function(angle, duration, easing, complete) {
    var args = $.speed(duration, easing, complete);
    var step = args.step;
    return this.each(function(i, e) {
        args.complete = $.proxy(args.complete, e);
        args.step = function(now) {
        $.style(e, 'transform', 'rotate(' + now + 'deg)');
            if (step) return step.apply(e, arguments);
        };

        $({deg: 0}).animate({deg: angle}, args);
    });
};

function preloadAudio(url) {
    var audio = new Audio();
    audio.addEventListener("canplaythrough", loadedAudio, false);
    audio.src = url;
};

function loadedAudio() {
    loaded++;
    if (loaded == audioFiles.length) {
    	$("#loading").hide();
        $("#body").show();
    }
};

function resizeElement(element, ratio) {
    element.width(element.width() / ratio);
    element.height(element.height() / ratio);

    if (element.css("position") === "absolute") {
        element.css("top", (getAbsolute(element, "top") / ratio) + "px");
        element.css("left", (getAbsolute(element, "left") / ratio) + "px");
    }
};

function getAbsolute(element, pos) {
    return Number(element.css(pos).slice(0, -2));
};

function playAudio(filename) {
    player[0].src = filename;
    player[0].play();
};

$(document).ready(function() {
    if (window.matchMedia("only screen and (max-width: 760px)").matches) {
        var width = document.documentElement.clientWidth - 70;
        var ratio = mi9t.width() / width;
    } else {
        var height = document.documentElement.clientHeight - 70;
        var ratio = mi9t.height() / height;
    }

    startPos = getAbsolute(camera, "top") / ratio;
    cswitch.on("click", switchCamera);

    // kurwa jebane absolut i brak responsive
    resizeElement(mi9t, ratio);
    resizeElement(camera, ratio);
    resizeElement(viewport, ratio);
    resizeElement(cswitch, ratio);

    // przeładuj dźwięki aby nie było "laga"
    for (var i in audioFiles) {
        preloadAudio(audioFiles[i]);
    }
});

function switchCamera() {
    var cameraPos = parseInt(getAbsolute(camera, "top"));
    var isOpen = cameraPos === 1;

    if (cameraPos > 1 && cameraPos < parseInt(startPos)) {
        return;
    }

    endPos = isOpen ? startPos : 1;
    background = isOpen ? "landscape.png" : "portrait.png";
    filename = isOpen ? "elo.ogg" : "arix.ogg";

    counter++;

    cswitch.animateRotate(isOpen ? -180 : 180);
    playAudio(filename);
    
    camera.animate({ top: endPos }, 1200, "linear", function() {
        viewport.css("background-image", "url(" + background + ")");
        localStorage.setItem("counter", counter);
        
        // odpal inbe
        if (counter === 2137) {
            viewport.html('<iframe src="https://www.youtube-nocookie.com/embed/zglAhtxH9LY?autoplay=1&loop=1&fs=0&controls=0&disablekb=1" width="' + viewport.width() + '" height="' + viewport.height() + '" frameborder="0"></iframe>');
        } else {
            viewport.html("");
        }
    });
};
