function dropHandler(event) {
    event.preventDefault();

    let dropArea = $(".file-area .drop-area");
    if (dropArea.hasClass("highlight-drop")) {
        console.log("removed class");
        dropArea.addClass("inset-dark-border");
        dropArea.removeClass("highlight-drop");
    }

    if (event.dataTransfer.items) {
        for (let i = 0; i < event.dataTransfer.items.length; i++) {
            const file = event.dataTransfer.items[i];

            //console.log("From DataTransferItemList API: ", file);

            if (file.kind == "file" && file.type == "image/jpeg") {
                console.log("Image dropped");
                let fileHere = file.getAsFile();
                console.log(fileHere);
                const reader = new FileReader();
                reader.readAsDataURL(fileHere);
                reader.addEventListener("load", () => {
                    console.log("after conversion: ", reader.result);
                    let img = $(".drop-area .plus-icon");
                    img.css("width", "50%");
                    img.css("height", "50%");
                    img.attr("src", reader.result);
                });
            } else {
                console.log("Non-image dropped");
            }
        }
    } else {
        for (let i = 0; i < event.dataTransfer.files.length; i++) {
            const file = event.dataTransfer.files[i];

            if (file.kind == "file" && file.type == "image/jpeg") {
                console.log("Image dropped");
            } else {
                console.log("Non-image dropped");
            }
        }
    }
}

function dragOverHandler(event) {
    event.preventDefault();
}

function dragEnterHandler(event) {
    event.preventDefault();
    let dropArea = $(".file-area .drop-area");
    if (!dropArea.hasClass("highlight-drop")) {
        console.log("added class");
        dropArea.removeClass("inset-dark-border");
        dropArea.addClass("highlight-drop");
    }
}

function dragLeaveHandler(event) {
    event.preventDefault();
    let dropArea = $(".file-area .drop-area");
    if (dropArea.hasClass("highlight-drop")) {
        console.log("removed class");
        dropArea.addClass("inset-dark-border");
        dropArea.removeClass("highlight-drop");
    }
}

$("#input-file").on("change", () => {
    //ridiculous how odd this looks VV
    let file = document.forms["form-file"]["input-file"].files[0];

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener("load", () => {
        let img = $(".drop-area .plus-icon");
        img.css("width", "50%");
        img.css("height", "50%");
        img.attr("src", reader.result);
    });
});

$("#add-file").click(() => {
    console.log("focused");

    $("#input-file").click();
});
