const express = require("express");
let fs = require("fs");
let app = express();

const port = 3000;

app.listen(port, () => {
    console.log("Server up");
});

app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

const path = "server/clients.json";

let idCount = 0;
let clients = [];

class Client {
    constructor(img, name, sex, age, nat, id) {
        this.img = img;
        this.name = name;
        this.sex = sex;
        this.age = age;
        this.nat = nat;
        this.id = id;
    }
}

try {
    let rawData = fs.readFileSync(path);
    let data = JSON.parse(rawData);
    clients = data.clients;
    if (clients.length > 0) {
        idCount = parseInt(clients[0].id) + 1;
    }
} catch (error) {
    console.log("Couldnt read file: ", error);
}

app.post("/add-client", (request, response) => {
    let newClient = request.body;

    clients.unshift(
        new Client(
            newClient.img,
            newClient.name,
            newClient.sex,
            newClient.age,
            newClient.nat,
            idCount.toString()
        )
    );

    let resp;

    try {
        let jsonData = {
            clients: clients
        };
        fs.writeFileSync(path, JSON.stringify(jsonData));
        resp = {
            status: "ok"
        };
    } catch (error) {
        resp = {
            status: "error"
        };
        console.log("error adding client: ", error);
    }

    response.send(resp);
    idCount++;
});

app.post("/clients", (request, response) => {
    let reqBody = request.body;

    if (reqBody.asked == "all") {
        let res = {};
        if (clients.length > 0) {
            res = {
                status: "ok",
                headers: {
                    "Content-Type": "application/json"
                },
                body: clients
            };
        } else {
            idCount = 0;
            res = {
                status: "no-clients",
                headers: {
                    "Content-Type": "html/text"
                }
            };
        }
        response.send(res);
    } else if (reqBody.asked == "searchFor") {
        let param = reqBody.param;
        let matches = [];
        clients.forEach((client) => {
            let keys = Object.keys(client);

            for (let i = 0; i < keys.length; i++) {
                if (keys[i] != "img") {
                    if (
                        client[keys[i]]
                            .toLowerCase()
                            .search(param.toLowerCase()) != -1
                    ) {
                        matches.push(client);
                        break;
                    }
                }
            }
        });

        let res = {
            status: "ok",
            headers: {
                "Content-Type": "application/json"
            },
            body: matches
        };

        response.send(res);
    } else if (reqBody.asked == "delete") {
        let id = reqBody.id;
        let index = clients.findIndex((client) => {
            return client.id == id;
        });

        let res;

        if (index != -1) {
            clients.splice(index, 1);

            try {
                let jsonData = {
                    clients: clients
                };
                fs.writeFileSync(path, JSON.stringify(jsonData));
                resp = {
                    status: "ok"
                };
            } catch (error) {
                resp = {
                    status: "error"
                };
                console.log("error removing client: ", error);
            }
        } else {
            resp = {
                status: "error"
            };
        }
        response.send(resp);
    }
});
