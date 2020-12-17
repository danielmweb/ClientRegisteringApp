class ClientCard {
    constructor(img, name, sex, age, nationality, id) {
        this.img = img;
        this.name = name;
        this.sex = sex;
        this.age = age;
        this.nationality = nationality;
        this.id = id;
        this.card = `<div class="client">
        <div class="icon">
            <img src=${this.img} width="64px" height="64px"/>
        </div>
        <p>Nome: ${this.name}</p>
        <p>Sexo: ${this.sex}</p>
        <p>Idade: ${this.age} anos</p>
        <p>id: ${this.id}</p>
        <p>Nacionalidade: ${this.nationality}</p>
    </div>`;
    }
}

let clientsArray = [];

$("#btnAdd").click(() => {
    let name = $("#name-field").val();
    let sex = $("#sex-field").val();
    let age = $("#age-field").val();
    let nat = $("#nat-field").val();
    let img = $("#client-img").attr("src");

    let client = {
        name: name,
        sex: sex,
        age: age,
        nat: nat,
        id: "0",
        img: img
    };
    console.log(client);

    let invalid = false;
    let invalidKeys = [];

    let keys = Object.keys(client);
    keys.forEach((key) => {
        if (client[key] == "") {
            invalidKeys.push(key);
            invalid = true;
        } else if (key == "age" && isNaN(client["age"])) {
            invalidKeys.push(key);
            invalid = true;
        }
    });
    if (!invalid) {
        sendClient(client);
    } else {
        let btnContainer = document.getElementById("btnAdd");
        colorEffect(btnContainer, "red");
        invalidKeys.forEach((key) => {
            let id = `${key}-field`;
            let field = document.getElementById(id);
            if (id == "age-field" && field.value != "") {
                field.setAttribute(
                    "placeholder",
                    "Ops, apenas números aqui :)"
                );
            } else {
                field.setAttribute(
                    "placeholder",
                    "Ops, este campo está vazio :/"
                );
            }
            field.value = "";

            field.classList.add("shaking-field");

            field.getAnimations()[0].addEventListener("finish", () => {
                field.classList.remove("shaking-field");
            });
        });
    }

    fillClientCards();
});

$("#btnRemove").click(async () => {
    if (currentSelected != undefined) {
        let request = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                asked: "delete",
                id: currentSelected
            })
        };

        let response = await fetch("clients", request);
        let data = await response.json();
        let btnRemove = document.getElementById("btnRemove");
        if (data.status == "ok") {
            let removed = document.getElementById(currentSelected);
            colorEffect(btnRemove, "green");
            colorEffect(removed, "red", fillClientCards);
            currentSelected = undefined;
        } else {
            colorEffect(btnRemove, "red");
        }
    } else {
        colorEffect(btnRemove, "red");
    }
});

async function sendClient(client) {
    let request = {
        method: "POST",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(client)
    };

    let response = await fetch("add-client", request);
    let data = await response.json();

    if (data.status == "ok") {
        console.log("client added");
        let btnAdd = document.getElementById("btnAdd");
        colorEffect(btnAdd, "green");
    }
}

function colorEffect(element, color, callBack) {
    //only supports "green" and "red"
    element.classList.add(color + "-transition");
    element.getAnimations()[0].addEventListener("finish", () => {
        element.classList.remove(color + "-transition");
        if (callBack != undefined) {
            callBack();
        }
    });
}

async function fillClientCards() {
    let clients = await getClients();
    $(".client").remove();
    if (clients != "error") {
        clientsArray = clients;
        appendAndIdClients(clients);

        setClickListeners();
    }
}

function appendAndIdClients(clients) {
    clientsArray = clients;
    clients.forEach((client) => {
        let newClient = new ClientCard(
            client.img,
            client.name,
            client.sex,
            client.age,
            client.nat,
            client.id
        );
        $(".client-viewer").append(newClient.card);
        $(".client")[$(".client").length - 1].id = newClient.id;
    });
}

async function getClients() {
    let data = {
        asked: "all"
    };
    let request = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };

    let rawClients = await fetch("clients", request);

    let clients = await rawClients.json();

    if (clients.status == "ok") {
        return clients.body;
    } else {
        console.log("no clients in the server");
        return "error";
    }
}

fillClientCards();

let currentSelected;

function setClickListeners() {
    $(".client").click((event) => {
        let id = event.currentTarget.id;
        let card = $(`#${id}`);
        //let cards = document.getElementsByClassName("client");
        let cards = $(".client");

        if (card.hasClass("selected-card")) {
            console.log("called");
            card.removeClass("selected-card");
            currentSelected = undefined;
        } else {
            cards.removeClass("selected-card");
            card.addClass("selected-card");
            currentSelected = id;
        }
    });
}

$(".search-bar").on("input", async () => {
    let param = $(".search-bar").val();
    $(".client").remove();
    if (param != "") {
        let request = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                asked: "searchFor",
                param: param
            })
        };

        let response = await fetch("clients", request);
        let data = await response.json();
        let clients = data.body;

        clientsArray = clients;

        appendAndIdClients(clients);
        setClickListeners();
    } else {
        fillClientCards();
    }
});
