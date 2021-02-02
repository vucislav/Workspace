import { Card } from "./card.js";

export class Category {
    constructor(id, name, cards, board) {
        this.id = id;
        this.name = name;
        this.cards = [];
        cards.forEach(e => this.cards.push(new Card(e.id, e.name, e.description, e.tag, id, board)));
        this.elem = null;
    }

    draw(cont) {
        var thisptr = this;

        this.elem = document.createElement("div");
        this.elem.classList.add("category");

        var title = document.createElement("h2");

        var titleText = document.createElement("span");
        titleText.innerHTML = this.name;
        title.appendChild(titleText);

        var btnDelete = document.createElement("button");
        btnDelete.innerHTML = "X";
        btnDelete.classList.add("delete");
        btnDelete.onclick = function(e) {
            e.preventDefault();
            if (confirm("Are you sure you want to delete this category?")) {
                fetch("https://localhost:5001/Category/DeleteCategory/" + thisptr.id, {
                    method: 'DELETE',
                    mode: 'cors'
                }).then(resp => {
                    if (resp.status == 204) {
                        thisptr.elem.remove();
                        Array.from(document.querySelectorAll(`.category-select option[value='${thisptr.id}']`)).forEach(o => o.remove());
                        alert("Category successfully deleted!");
                    }
                });
            }
        }
        title.appendChild(btnDelete);

        this.elem.appendChild(title);
        this.elem.appendChild(document.createElement("hr"));

        this.cards.forEach(e => e.draw(this.elem));

        cont.appendChild(this.elem);
    }

    addCard(c) {
        this.cards.push(c);
        c.draw(this.elem);
    }
}