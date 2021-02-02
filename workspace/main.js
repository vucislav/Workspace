import { Board } from "./board.js"

var boards = {}

fetch("https://localhost:5001/Board/GetBoards").then(p => {
    p.json().then(data => {
        var forma = document.createElement("form");

        var lblName = document.createElement("span");
        lblName.innerHTML = "Name: ";
        forma.appendChild(lblName);
        forma.appendChild(document.createElement("br"));
        var inputName = document.createElement("input");
        inputName.type = "text";
        forma.appendChild(inputName);

        forma.appendChild(document.createElement("br"));

        var lblDesc = document.createElement("span");
        lblDesc.innerHTML = "Description: ";
        forma.appendChild(lblDesc);
        forma.appendChild(document.createElement("br"));
        var inputDesc = document.createElement("input");
        inputDesc.type = "text";
        forma.appendChild(inputDesc);

        forma.appendChild(document.createElement("br"));

        var btnSubmit = document.createElement("button");
        btnSubmit.onclick = function(e) {
            e.preventDefault()
            if (inputName.value == "") {
                alert("Please input a name for the new board");
                return;
            }
            if (inputName.value.length > 50) {
                alert("The board name length cannot exceed 50 characters");
                return;
            }
            fetch("https://localhost:5001/Board/CreateBoard/", {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Name: inputName.value,
                    Description: inputDesc.value
                })
            }).then(resp => {
                if (resp.status == 200) {
                    resp.json().then(id => {
                        boards[id] = new Board(id);
                        var newBoard = document.createElement("option");
                        newBoard.innerHTML = inputName.value;
                        newBoard.value = id;
                        select.appendChild(newBoard);

                        inputName.value = "";
                        inputDesc.value = "";
                        alert("Board created successfully!");
                    })
                }
            });
        }
        btnSubmit.innerHTML = "Create new board";
        forma.appendChild(btnSubmit);

        document.body.appendChild(forma);

        var tekst = document.createElement("span");
        tekst.innerHTML = "or pick your board: ";
        document.body.appendChild(tekst);

        var select = document.createElement("select");
        select.id = "pickBoard";
        var dummyOpt = document.createElement("option");
        dummyOpt.setAttribute("disabled", "");
        dummyOpt.setAttribute("selected", "");
        dummyOpt.setAttribute("value", "0");
        dummyOpt.setAttribute("hidden", "");
        select.appendChild(dummyOpt);

        var container = document.createElement("div");
        container.innerHTML = "Please load a board!"
        container.id = "container";

        data.forEach(e => {
            boards[e.id] = new Board(e.id);
            var opt = document.createElement("option");
            opt.innerHTML = e.name;
            opt.value = e.id;
            select.appendChild(opt);
        });
        select.onchange = function() {
            container.innerHTML = "";
            boards[select.value].draw(container);
        }
        document.body.appendChild(select);
        document.body.appendChild(container);
    })
})