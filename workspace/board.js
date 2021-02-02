import { Category } from "./category.js";
import { Card } from "./card.js"

export class Board {
    constructor(id) {
        this.id = id;
        this.name = null;
        this.description = null;
        this.categories = {};
    }

    async load() {
        var resp = await fetch("https://localhost:5001/Board/GetBoard/" + this.id);
        var data = await resp.json();
        this.name = data["name"];
        this.description = data["description"];
        var thisptr = this;
        data["categories"].forEach(e => {
            this.categories[e.id] = new Category(e.id, e.name, e.cards, thisptr);
        });
    }

    async draw(cont) {
        if (this.name == null) await this.load();
        var thisptr = this;

        var name = document.createElement("h1");
        var nameText = document.createElement("span");
        nameText.innerHTML = this.name;
        name.appendChild(nameText);

        var btnDelete = document.createElement("button");
        btnDelete.classList.add("delete");
        btnDelete.innerHTML = "X";
        var id = this.id;
        btnDelete.onclick = function(e) {
            e.preventDefault();
            if (confirm("Are you sure you want to delete this board?")) {
                fetch("https://localhost:5001/Board/DeleteBoard/" + id, {
                    method: 'DELETE',
                    mode: 'cors'
                }).then(resp => {
                    if (resp.status == 204) {
                        document.querySelector(`option[value="${id}"]`).remove();
                        document.querySelector("#pickBoard").value = 0;
                        cont.innerHTML = "";
                        alert("Board successfully deleted!");
                    }
                });
            }
        }
        name.appendChild(btnDelete);

        var btnEditName = document.createElement("button");
        btnEditName.innerHTML = "&#9998;";
        btnEditName.classList.add("edit");
        btnEditName.onclick = function(e) {
            e.preventDefault();
            var newName = prompt("Enter new name:");
            if (newName != null) {
                if (newName == "") {
                    alert("Please input a name for the new board");
                    return;
                }
                if (newName.length > 50) {
                    alert("The board name length cannot exceed 50 characters");
                    return;
                }
                fetch("https://localhost:5001/Board/EditBoard/" + id, {
                    method: 'PUT',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        Name: newName,
                        Description: thisptr.description
                    })
                }).then(resp => {
                    if (resp.status == 204) {
                        thisptr.name = newName;
                        nameText.innerHTML = newName;
                        document.querySelector(`option[value="${id}"]`).innerHTML = newName;
                        alert("Board successfully edited!");
                    }
                });
            }
        }
        name.appendChild(btnEditName);
        cont.appendChild(name);

        var desc = document.createElement("h5");
        var descText = document.createElement("span");
        descText.innerHTML = this.description;
        desc.appendChild(descText);
        var btnEditDesc = document.createElement("button");
        btnEditDesc.innerHTML = "&#9998;";
        btnEditDesc.classList.add("edit");
        btnEditDesc.onclick = function(e) {
            e.preventDefault();
            var newDescription = prompt("Enter new description:");
            if (newDescription != null) {
                fetch("https://localhost:5001/Board/EditBoard/" + id, {
                    method: 'PUT',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        Name: thisptr.name,
                        Description: newDescription
                    })
                }).then(resp => {
                    if (resp.status == 204) {
                        thisptr.description = newDescription;
                        descText.innerHTML = newDescription;
                        alert("Board successfully edited!");
                    }
                });
            }
        }
        desc.appendChild(btnEditDesc);
        cont.appendChild(desc);

        cont.appendChild(document.createElement("hr"));

        var formsDiv = document.createElement("div");
        formsDiv.classList.add("flex-container");
        formsDiv.style.justifyContent = "space-around";

        var newCategoryForm = document.createElement("form");
        var categoryFormTitle = document.createElement("p");
        categoryFormTitle.innerHTML = "Create new category: ";
        newCategoryForm.appendChild(categoryFormTitle);
        var categoryNameLabel = document.createElement("span");
        categoryNameLabel.innerHTML = "Name: ";
        newCategoryForm.appendChild(categoryNameLabel);
        var categoryNameInput = document.createElement("input");
        categoryNameInput.type = "text";
        newCategoryForm.appendChild(categoryNameInput);
        var newCategoryButton = document.createElement("button");
        newCategoryButton.innerHTML = "Create";
        newCategoryButton.onclick = function(e) {
            e.preventDefault();
            if (categoryNameInput.value == "") {
                alert("Please input a name for the new category");
                return;
            }
            if (categoryNameInput.value.length > 30) {
                alert("The category name length cannot exceed 30 characters");
                return;
            }
            fetch("https://localhost:5001/Category/CreateCategory/" + thisptr.id, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Name: categoryNameInput.value,
                })
            }).then(resp => {
                if (resp.status == 200) {
                    resp.json().then(id => {
                        var newCat = new Category(id, categoryNameInput.value, [], thisptr);
                        thisptr.categories[id] = newCat;
                        newCat.draw(flex_cont);
                        Array.from(document.getElementsByClassName("category-select")).forEach(s => {
                            var option = document.createElement("option");
                            option.value = id;
                            option.innerHTML = categoryNameInput.value;
                            s.appendChild(option);
                        })
                        categoryNameInput.value = "";
                        alert("Category created successfully!");
                    })
                }
            });
        };
        newCategoryForm.appendChild(newCategoryButton);
        formsDiv.appendChild(newCategoryForm);

        var newCardForm = document.createElement("form");
        var cardFormTitle = document.createElement("p");
        cardFormTitle.innerHTML = "Create new card: ";
        newCardForm.appendChild(cardFormTitle);

        var cardTitleLabel = document.createElement("label");
        cardTitleLabel.innerHTML = "Title: ";
        newCardForm.appendChild(cardTitleLabel);
        var cardTitleInput = document.createElement("input");
        cardTitleInput.type = "text";
        newCardForm.appendChild(cardTitleInput);
        newCardForm.appendChild(document.createElement("br"));

        var cardDescriptionLabel = document.createElement("label");
        cardDescriptionLabel.innerHTML = "Description: ";
        newCardForm.appendChild(cardDescriptionLabel);
        var cardDescriptionInput = document.createElement("input");
        cardDescriptionInput.type = "text";
        newCardForm.appendChild(cardDescriptionInput);
        newCardForm.appendChild(document.createElement("br"));

        var cardTagLabel = document.createElement("label");
        cardTagLabel.innerHTML = "Tag: ";
        newCardForm.appendChild(cardTagLabel);
        var cardTagInput = document.createElement("input");
        cardTagInput.type = "text";
        newCardForm.appendChild(cardTagInput);
        newCardForm.appendChild(document.createElement("br"));

        var cardCategoryLabel = document.createElement("label");
        cardCategoryLabel.innerHTML = "Category: ";
        newCardForm.appendChild(cardCategoryLabel);
        var cardCategorySelect = document.createElement("select");
        cardCategorySelect.classList.add("category-select");
        cardCategorySelect.classList.add("new-select");
        for (let i in this.categories) {
            let c = this.categories[i];
            var option = document.createElement("option");
            option.value = c.id;
            option.innerHTML = c.name;
            cardCategorySelect.appendChild(option);
        }
        newCardForm.appendChild(cardCategorySelect);
        newCardForm.appendChild(document.createElement("br"));

        var newCardButton = document.createElement("button");
        newCardButton.innerHTML = "Create";
        newCardButton.onclick = function(e) {
            e.preventDefault();
            if (cardTitleInput.value == "") {
                alert("Please input a name for the new card");
                return;
            }
            if (cardTitleInput.value.length > 50) {
                alert("The card name length cannot exceed 50 characters");
                return;
            }
            if (cardTagInput.value.length > 10) {
                alert("The card tag length cannot exceed 10 characters");
                return;
            }
            fetch("https://localhost:5001/Card/CreateCard/" + cardCategorySelect.value, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Name: cardTitleInput.value,
                    Description: cardDescriptionInput.value,
                    Tag: cardTagInput.value
                })
            }).then(resp => {
                if (resp.status == 200) {
                    resp.json().then(id => {
                        var newCard = new Card(id, cardTitleInput.value, cardDescriptionInput.value, cardTagInput.value, cardCategorySelect.value, thisptr);
                        thisptr.categories[cardCategorySelect.value].addCard(newCard);

                        cardTitleInput.value = "";
                        cardDescriptionInput.value = "";
                        cardTagInput.value = "";

                        alert("Card created successfully!");
                    })
                }
            });
        };
        newCardForm.appendChild(newCardButton);
        formsDiv.appendChild(newCardForm);


        cont.appendChild(formsDiv);
        cont.appendChild(document.createElement("hr"));

        var flex_cont = document.createElement("div");
        flex_cont.classList.add("flex-container");
        cont.appendChild(flex_cont);
        for (let i in this.categories) {
            let c = this.categories[i];
            c.draw(flex_cont);
        }
    }
}