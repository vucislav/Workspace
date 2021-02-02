export class Card {
    constructor(id, name, description, tag, catId, board) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.tag = tag;
        this.catId = catId;
        this.board = board;
        this.elem = null;
    }

    draw(cont) {
        var thisptr = this;

        this.elem = document.createElement("div");
        this.elem.classList.add("card");

        var header = document.createElement("p");
        var title = document.createElement("span");
        title.innerHTML = this.name;
        header.appendChild(title);
        var tag = document.createElement("span");
        tag.classList.add("tag");
        tag.innerHTML = this.tag;
        header.appendChild(tag);
        var btnDelete = document.createElement("button");
        btnDelete.innerHTML = "X";
        btnDelete.classList.add("delete");
        btnDelete.onclick = function(e) {
            e.preventDefault();
            if (confirm("Are you sure you want to delete this card?")) {
                fetch("https://localhost:5001/Card/DeleteCard/" + thisptr.id, {
                    method: 'DELETE',
                    mode: 'cors'
                }).then(resp => {
                    if (resp.status == 204) {
                        thisptr.elem.remove();
                        alert("Card successfully deleted!");
                    }
                });
            }
        }
        header.appendChild(btnDelete);
        this.elem.appendChild(header);
        this.elem.appendChild(document.createElement("hr"));

        var desc = document.createElement("p");
        desc.innerHTML = this.description;
        this.elem.appendChild(desc);

        var footer = document.createElement("p");

        var moveLabel = document.createElement("span");
        moveLabel.innerHTML = "Move to: ";
        footer.appendChild(moveLabel);

        var moveSelect = document.createElement("select");
        moveSelect.classList.add("category-select");
        Array.from(document.querySelectorAll("form .category-select option")).forEach(e => {
            if (e.value != thisptr.catId) moveSelect.appendChild(e.cloneNode(true))
        });
        footer.appendChild(moveSelect);

        var moveButton = document.createElement("button");
        moveButton.innerHTML = "Move";
        moveButton.onclick = function(e) {
            e.preventDefault();
            fetch("https://localhost:5001/Card/EditCard/" + thisptr.id, {
                method: 'PUT',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Name: thisptr.name,
                    Description: thisptr.description,
                    Tag: thisptr.tag,
                    CategoryId: parseInt(moveSelect.value)
                })
            }).then(resp => {
                if (resp.status == 204) {
                    thisptr.elem.remove();
                    thisptr.catId = moveSelect.value;
                    thisptr.board.categories[moveSelect.value].addCard(thisptr);
                    alert("Card successfully moved!");
                }
            });
        };
        footer.appendChild(moveButton);

        this.elem.appendChild(footer);

        cont.appendChild(this.elem);
    }
}