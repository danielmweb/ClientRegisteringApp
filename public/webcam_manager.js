let camWidth, camHeight;

let video, canvas;

function initWebcam() {
    video = createCapture(VIDEO);
    video.parent("cam");
    video.hide();
    setCamSize();
    canvas = createCanvas(camWidth, camHeight);
    canvas.parent("cam");
    $("#defaultCanvas0").css("visibility", "visible");
    //video.size(camWidth, camHeight);
    //setCamSize();
}

function setup() {
    noCanvas();
}

let xRect, yRect, rectSize;
let displaying = false;
function draw() {
    if (displaying) {
        let vHeight = camHeight;
        let vWidth = (video.width / video.height) * camHeight;
        let isOverAspect = vWidth > camWidth;
        if (isOverAspect) {
            vWidth = camWidth;
            vHeight = (video.height / video.width) * vWidth;
        }
        let x = camWidth / 2 - vWidth / 2;
        let y = camHeight / 2 - vHeight / 2;

        image(video, x, y, vWidth, vHeight);
        rectSize = vHeight;
        xRect = camWidth / 2 - rectSize / 2;
        yRect = camHeight / 2 - rectSize / 2;
        noFill();
        stroke(255, 0, 0);
        strokeWeight(4);
        rect(xRect, yRect, rectSize, rectSize);
    }
}

function takePicture() {
    if (canvas == undefined) {
        let imgArea = $(".img-area");
        imgArea.addClass("shaking-field");
        imgArea.on("animationend", () => {
            imgArea.removeClass("shaking-field");
        });
        return;
    }

    let rectImg = get(xRect, yRect, rectSize, rectSize);
    rectImg.loadPixels();
    let encodedImg = rectImg.canvas.toDataURL();
    let icon = $("#cam .plus-icon");
    icon.attr("src", encodedImg);
    icon.css("width", rectSize + "px");
    icon.css("height", rectSize + "px");

    canvas.remove();
    canvas = undefined;
    video.remove();
    displaying = false;
    $("#cam .plus-icon").show();
    $("#camOnOff > p").text("Ligar WebCam");
    $("#take-pic").attr("disabled", true);
}

$(() => {
    $(window).on("resize", () => {
        setCamSize();
        resizeCanvas(camWidth, camHeight);
    });
});

function setCamSize() {
    camWidth = $("#cam").width();
    camHeight = $("#cam").height();
}

$("#cam, #camOnOff").click(() => {
    if (!displaying) {
        initWebcam();
        displaying = true;
        $("#cam .plus-icon").hide();
        $("#camOnOff > p").text("Desligar WebCam");
    } else {
        canvas.remove();
        canvas = undefined;
        video.remove();
        displaying = false;
        $("#cam .plus-icon").show();
        $("#camOnOff > p").text("Ligar WebCam");
    }
});

$("#take-pic").click(takePicture);
