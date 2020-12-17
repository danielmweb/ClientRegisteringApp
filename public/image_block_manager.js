let container = $(".img-block .container");
//compatibility
container.on("animationend", (target) => {
    let name = target.originalEvent.animationName;
    if (name == "fade-out-container") {
        container.removeClass("fade-out-animation");
        $(".img-block").hide();
        container.css("opacity", "0%");
    } else if (name == "fade-in-container") {
        container.css("opacity", "100%");
    }
});
//compatibility
container.on("webkitAnimationEnd", (target) => {
    let name = target.originalEvent.animationName;
    if (name == "fade-out-container") {
        container.removeClass("fade-out-animation");
        $(".img-block").hide();
        container.css("opacity", "0%");
    } else if (name == "fade-in-container") {
        container.css("opacity", "100%");
    }
});

$(".btn-cancel, .btn-cancel-container").click(() => {
    resetState();

    $("#client-img").attr("src", "icons/person-black-18dp.svg");

    container.addClass("fade-out-animation");
});

$(".btn-done").click(() => {
    if (selected == undefined) {
        $(".btn-use-file, .btn-use-img").addClass("shaking-field");
        $(".btn-use-file, .btn-use-img").on("animationend", () => {
            $(".btn-use-file, .btn-use-img").removeClass("shaking-field");
        });
        return;
    }
    $("#client-img").attr("src", selected);

    resetState();
    //send selected to the form's icon

    container.addClass("fade-out-animation");
    resetSelectedEffects([$(".btn-use-file"), $(".btn-use-img")]);
});

function resetState() {
    if (canvas != undefined) {
        canvas.remove();
        video.remove();
    }

    displaying = false;
    $("#cam .plus-icon").show();
    $("#camOnOff > p").text("Ligar WebCam");

    let plusIconCam = $("#cam .plus-icon");
    plusIconCam.attr("src", "icons/plus-sign.svg");
    plusIconCam.css("width", "64px");
    plusIconCam.css("height", "64px");
    let plusIconFile = $(".drop-area .plus-icon");
    plusIconFile.attr("src", "icons/plus-sign.svg");
    plusIconFile.css("width", "64px");
    plusIconFile.css("height", "64px");
    imgBlockIsVisible = false;
    selected = undefined;
}

let imgBlockIsVisible = false;

$("#client-img").click(() => {
    if (imgBlockIsVisible) {
        $(".img-block").hide();
        imgBlockIsVisible = false;
    } else {
        $(".img-block").css("display", "flex");
        imgBlockIsVisible = true;
    }
});

let selected;

$(".btn-use-file").click(() => {
    let img = $(".drop-area .plus-icon").attr("src");
    if (img == "icons/plus-sign.svg") {
        let fileArea = $(".file-area");
        fileArea.addClass("shaking-field");
        fileArea.on("animationend", () => {
            fileArea.removeClass("shaking-field");
        });
        return;
    }
    resetSelectedEffects([$(".btn-use-file"), $(".btn-use-img")]);
    applySelectedEffect($(".btn-use-file"));
    selected = $(".drop-area .plus-icon").attr("src");
});

function applySelectedEffect(element) {
    element.addClass("selected-effect");
}

function resetSelectedEffects(elements) {
    elements.forEach((element) => {
        if (element.hasClass("selected-effect")) {
            element.removeClass("selected-effect");
        }
    });
}

$(".btn-use-img").click(() => {
    let img = $("#cam .plus-icon").attr("src");
    if (img == "icons/plus-sign.svg") {
        let imgArea = $(".img-area");
        imgArea.addClass("shaking-field");
        imgArea.on("animationend", () => {
            imgArea.removeClass("shaking-field");
        });
        return;
    }
    resetSelectedEffects([$(".btn-use-file"), $(".btn-use-img")]);
    applySelectedEffect($(".btn-use-img"));
    selected = $("#cam .plus-icon").attr("src");
});
