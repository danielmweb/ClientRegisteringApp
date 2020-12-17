window.addEventListener("resize", resizeView);
let collapsed = true;
function resizeView() {
    let width = window.innerWidth;

    if (width >= 800) {
        $(".left-column").css("width", "54%");
        $(".form-part").css("display", "flex");
        $(".btn-part").css("display", "flex");
    } else {
        $(".left-column").css("width", "15%");
        $(".form-part").css("display", "none");
        $(".btn-part").css("display", "none");
    }
    $(".icon-container").removeClass("horizontal-icon");
    collapsed = true;
    $(".client-block").height(window.innerHeight);
}

resizeView();

$(".toggler").click(() => {
    if (collapsed) {
        $(".left-column").animate({ width: "80%" }, 200, () => {
            $(".form-part").css("display", "flex");
            $(".btn-part").css("display", "flex");
        });
        $(".icon-container").addClass("horizontal-icon");
    } else {
        $(".left-column").animate({ width: "15%" }, 200);
        $(".icon-container").removeClass("horizontal-icon");
        $(".form-part").hide();
        $(".btn-part").hide();
    }
    collapsed = !collapsed;
});
