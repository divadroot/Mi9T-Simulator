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

    startPos = parseInt(getAbsolute(camera, "top") / ratio);
    cswitch.on("click", switchCamera);

    // kurwa jebane absolut i brak responsive
    resizeElement(mi9t, ratio);
    resizeElement(camera, ratio);
    resizeElement(viewport, ratio);
    resizeElement(cswitch, ratio);
    
    $(".github-corner").load("github.svg");

    // przeładuj dźwięki aby nie było "laga"
    for (var i in audioFiles) {
        preloadAudio(audioFiles[i]);
    }
});

function switchCamera() {
    var cameraPos = parseInt(getAbsolute(camera, "top"));
    var isOpen = cameraPos === 0;

    if (cameraPos > 0 && cameraPos < startPos) {
        return;
    }

    offset = isOpen ? 1 : -1;
    endPos = isOpen ? startPos : 0;
    imgUrl = isOpen ? "landscape.png" : "portrait.png";

    if (!isOpen) {
        playAudio("arix.ogg");
    } else {
        playAudio("elo.ogg");
    }

    setTimeout(function() {
        playAnimation(offset, endPos, imgUrl);
    }, 200);
};

function playAnimation(offset, endPos, imgUrl) {
    timer = setInterval(function() {
        var currentPos = getAbsolute(camera, "top")
        if (parseInt(currentPos) === endPos) {
            viewport.css("background-image", "url(" + imgUrl + ")");
            clearInterval(timer);
            return;
        }

        camera.css("top", (currentPos + offset) + "px");
    }, 30);
};
